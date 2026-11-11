import AuthLayout from '#/shared/layouts/AuthLayout/AuthLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-layout')({
  component: AuthLayout,
})

