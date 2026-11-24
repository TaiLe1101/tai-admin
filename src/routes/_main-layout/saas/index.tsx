import { createFileRoute } from '@tanstack/react-router'
import SaasOverviewPage from '#/features/saas/pages/SaasOverviewPage'

export const Route = createFileRoute('/_main-layout/saas/')({
  component: SaasOverviewPage,
})
