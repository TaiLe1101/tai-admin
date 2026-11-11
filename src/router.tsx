import { createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import { PageLoading } from '#/shared/components'

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: PageLoading
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}