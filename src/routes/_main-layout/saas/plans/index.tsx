import { createFileRoute } from '@tanstack/react-router'
import SaasPlansPage from '#/features/saas/pages/SaasPlansPage'

export const Route = createFileRoute('/_main-layout/saas/plans/')({
  component: SaasPlansPage,
})
