import axiosClient from '#/shared/api/axiosClient'
import type { ApiResponse } from '#/shared/types/api'
import type {
  AppReleaseQuery,
  UploadAppReleaseReq,
} from './dto/req/appReleaseReq'
import type { AppRelease, AppReleaseListRes } from './dto/res/appReleaseRes'

const ENDPOINT = '/app-releases'

export const getAppReleases = (
  params: AppReleaseQuery,
): Promise<AppReleaseListRes> => axiosClient.get(ENDPOINT, { params })

export const getAppRelease = (id: number): Promise<ApiResponse<AppRelease>> =>
  axiosClient.get(`${ENDPOINT}/${id}`)

export const deleteAppRelease = (
  id: number,
): Promise<ApiResponse<AppRelease>> => axiosClient.delete(`${ENDPOINT}/${id}`)

export const uploadAppRelease = async (
  files: UploadAppReleaseReq,
  onProgress: (percent: number) => void,
  signal: AbortSignal,
): Promise<ApiResponse<AppRelease>> => {
  const entries = Object.entries(files) as Array<
    [keyof UploadAppReleaseReq, File]
  >
  const session: ApiResponse<{ uploadId: string; chunkSize: number }> =
    await axiosClient.post(
      `${ENDPOINT}/uploads`,
      {
        files: Object.fromEntries(
          entries.map(([field, file]) => [
            field,
            { name: file.name, size: file.size },
          ]),
        ),
      },
      { signal },
    )
  const { uploadId, chunkSize } = session.data
  const url = `${ENDPOINT}/uploads/${uploadId}`
  const totalBytes = entries.reduce((sum, [, file]) => sum + file.size, 0)
  const parts = entries.flatMap(([field, file]) =>
    Array.from({ length: Math.ceil(file.size / chunkSize) }, (_, index) => ({
      field,
      index,
      blob: file.slice(index * chunkSize, (index + 1) * chunkSize),
    })),
  )
  const transferred = new Map<number, number>()
  const report = () =>
    onProgress(
      Math.min(
        99,
        Math.floor(
          ([...transferred.values()].reduce((sum, size) => sum + size, 0) /
            totalBytes) *
            100,
        ),
      ),
    )
  const controller = new AbortController()
  const abort = () => controller.abort()
  signal.addEventListener('abort', abort, { once: true })
  if (signal.aborted) abort()
  let cursor = 0
  try {
    const workers = Array.from(
      { length: Math.min(3, parts.length) },
      async () => {
        while (cursor < parts.length) {
          controller.signal.throwIfAborted()
          const partId = cursor++
          const part = parts[partId]
          await retryUpload(async () => {
            transferred.set(partId, 0)
            const data = new FormData()
            data.append('chunk', part.blob, 'chunk')
            await axiosClient.put(`${url}/${part.field}/${part.index}`, data, {
              headers: { 'Content-Type': undefined },
              timeout: 120_000,
              signal: controller.signal,
              onUploadProgress: ({ loaded, total }) => {
                transferred.set(
                  partId,
                  total
                    ? Math.min(
                        part.blob.size,
                        (loaded / total) * part.blob.size,
                      )
                    : 0,
                )
                report()
              },
            })
            transferred.set(partId, part.blob.size)
            report()
          }, controller.signal)
        }
      },
    )
    try {
      await Promise.all(workers)
    } catch (error) {
      controller.abort()
      await Promise.allSettled(workers)
      throw error
    }
    onProgress(100)
    return await retryUpload(
      () =>
        axiosClient.post(`${url}/complete`, undefined, {
          timeout: 120_000,
          signal: controller.signal,
        }),
      controller.signal,
    )
  } catch (error) {
    // Do not delete a session while completion may still be running server-side.
    await axiosClient.delete(url, { timeout: 15_000 }).catch(() => undefined)
    throw error
  } finally {
    signal.removeEventListener('abort', abort)
  }
}

async function retryUpload<T>(
  action: () => Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    signal.throwIfAborted()
    try {
      return await action()
    } catch (error) {
      const status = (error as { statusCode?: number }).statusCode
      if (
        signal.aborted ||
        attempt >= 4 ||
        (status &&
          status !== 409 &&
          status !== 408 &&
          status !== 429 &&
          status < 500)
      )
        throw error
      await new Promise<void>((resolve, reject) => {
        const abort = () => {
          clearTimeout(timer)
          signal.removeEventListener('abort', abort)
          reject(new DOMException('Đã hủy upload', 'AbortError'))
        }
        const timer = setTimeout(
          () => {
            signal.removeEventListener('abort', abort)
            resolve()
          },
          500 * 2 ** attempt + Math.random() * 250,
        )
        signal.addEventListener('abort', abort, { once: true })
        if (signal.aborted) abort()
      })
    }
  }
}
