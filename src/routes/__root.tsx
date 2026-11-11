import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import NotFoundPage from '#/features/error/pages/NotFoundPage/NotFoundPage'
import { ThemeProvider } from '#/app/providers/ThemeProvider'
import { QueryProvider } from '#/app/providers/QueryProvider'
import { PageLoading } from '#/shared/components'
import { StoreProvider } from '#/app/providers/StoreProvider'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  pendingComponent: PageLoading,
})

function RootComponent() {
  return (
    <StoreProvider>
      <QueryProvider>
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </QueryProvider>
    </StoreProvider>
  )
}

