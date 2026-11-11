import MainDashboard from '#/features/dashboard/pages/MainDashboard/MainDashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main-layout/')({

  component: MainDashboard,
})
