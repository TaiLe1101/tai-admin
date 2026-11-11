import PositionPage from '#/features/settings/pages/PositionPage/PositionPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main-layout/settings/position/')({
  component: PositionPage,
})

