import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import {
  deleteAppRelease,
  publishAppRelease,
  uploadAppRelease,
} from '../api/appReleaseApi'
import type { UploadAppReleaseReq } from '../api/dto/req/appReleaseReq'
import { APP_RELEASES_QUERY_KEY } from '../queries/useAppReleases'

export function useDeleteAppRelease() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAppRelease,
    onSuccess: (res) => {
      void message.success(res.message || 'Xóa bản nháp thành công')
      void queryClient.invalidateQueries({ queryKey: APP_RELEASES_QUERY_KEY })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function usePublishAppRelease() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: publishAppRelease,
    onSuccess: async (res) => {
      void message.success(res.message || 'Phát hành phiên bản thành công')
      await queryClient.invalidateQueries({ queryKey: APP_RELEASES_QUERY_KEY })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function useUploadAppRelease() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const [progress, setProgress] = useState(0)
  const controller = useRef<AbortController | null>(null)
  const mutation = useMutation({
    mutationFn: (files: UploadAppReleaseReq) => {
      controller.current = new AbortController()
      return uploadAppRelease(files, setProgress, controller.current.signal)
    },
    onMutate: () => {
      setProgress(0)
    },
    onSuccess: (res) => {
      void message.success(res.message || 'Tải phiên bản mới lên thành công')
      void queryClient.invalidateQueries({ queryKey: APP_RELEASES_QUERY_KEY })
    },
    onError: (error) => {
      if (!controller.current?.signal.aborted) void message.error(error.message)
    },
  })
  return { ...mutation, progress, cancel: () => controller.current?.abort() }
}
