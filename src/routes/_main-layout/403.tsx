import ForbiddenPage from '#/features/error/pages/ForbiddenPage/ForbiddenPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main-layout/403')({
  component: ForbiddenPage,
})
