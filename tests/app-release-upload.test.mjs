import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import test from 'node:test'
import ts from 'typescript'

// Execute the real API module with a controlled transport, without a browser.
const source = await readFile(
  new URL('../src/features/app-releases/api/appReleaseApi.ts', import.meta.url),
  'utf8',
)
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    esModuleInterop: true,
  },
})
function load(client) {
  const module = { exports: {} }
  new Function('require', 'module', 'exports', outputText)(
    () => ({ __esModule: true, default: client }),
    module,
    module.exports,
  )
  return module.exports.uploadAppRelease
}
const files = () => ({
  manifest: new File(['meta'], 'latest.yml'),
  installer: new File(['0123456789abcdefghi'], 'setup.exe'),
  blockmap: new File(['blockmap'], 'setup.exe.blockmap'),
})

test('limits concurrency, retries failed parts and completion, and preserves every byte', async () => {
  let active = 0
  let peak = 0
  let complete = 0
  let deleted = 0
  const attempts = new Map()
  const received = new Map()
  const progress = []
  const response = { data: { id: 42 } }
  const client = {
    async post(url) {
      if (url.endsWith('/uploads'))
        return { data: { uploadId: 'session', chunkSize: 4 } }
      complete++
      assert.equal(received.size, 8)
      if (complete === 1) throw new Error('Lost completion response')
      return response
    },
    async put(url, data, config) {
      active++
      peak = Math.max(peak, active)
      try {
        await delay(5, undefined, { signal: config.signal })
        const attempt = (attempts.get(url) ?? 0) + 1
        attempts.set(url, attempt)
        if (url.endsWith('/installer/1') && attempt === 1)
          throw Object.assign(new Error('Temporary failure'), {
            statusCode: 503,
          })
        const blob = data.get('chunk')
        config.onUploadProgress({ loaded: blob.size, total: blob.size })
        received.set(url, Buffer.from(await blob.arrayBuffer()))
      } finally {
        active--
      }
    },
    async delete() {
      deleted++
    },
  }
  const input = files()
  const result = await load(client)(
    input,
    (value) => progress.push(value),
    new AbortController().signal,
  )
  assert.deepEqual(result, response)
  assert.equal(peak, 3)
  assert.equal(complete, 2)
  assert.equal(deleted, 0)
  assert.equal(attempts.get('/app-releases/uploads/session/installer/1'), 2)
  assert.equal(progress.at(-1), 100)
  assert.ok(progress.slice(0, -1).every((value) => value < 100))
  for (const [field, file] of Object.entries(input)) {
    const buffers = Array.from(
      { length: Math.ceil(file.size / 4) },
      (_, index) =>
        received.get(`/app-releases/uploads/session/${field}/${index}`),
    )
    assert.deepEqual(
      Buffer.concat(buffers),
      Buffer.from(await file.arrayBuffer()),
    )
  }
})

test('cancels active requests, cleans the session and skips completion', async () => {
  const controller = new AbortController()
  let deleted = 0
  let started = 0
  const client = {
    async post(url) {
      assert.ok(url.endsWith('/uploads'))
      return { data: { uploadId: 'cancelled', chunkSize: 4 } }
    },
    async put(_url, _data, config) {
      started++
      await delay(100, undefined, { signal: config.signal })
    },
    async delete() {
      deleted++
    },
  }
  const promise = load(client)(files(), () => {}, controller.signal)
  setTimeout(() => controller.abort(), 10)
  await assert.rejects(promise)
  assert.equal(started, 3)
  assert.equal(deleted, 1)
})

test('stops all workers on a permanent error without retrying that part', async () => {
  let attempts = 0
  let deleted = 0
  const client = {
    async post(url) {
      assert.ok(url.endsWith('/uploads'))
      return { data: { uploadId: 'invalid', chunkSize: 4 } }
    },
    async put() {
      attempts++
      throw Object.assign(new Error('Invalid part'), { statusCode: 400 })
    },
    async delete() {
      deleted++
    },
  }
  await assert.rejects(
    load(client)(files(), () => {}, new AbortController().signal),
    /Invalid part/,
  )
  assert.equal(attempts, 3)
  assert.equal(deleted, 1)
})
