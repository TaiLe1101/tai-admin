export const ROUTE = {
  DASHBOARD: '/',
  APPLICATIONS: {
    RELEASES: '/applications/releases',
  },

  SAAS: {
    OVERVIEW: '/saas',
    PLANS: '/saas/plans',
    TENANTS: '/saas/tenants',
    UPGRADE_REQUESTS: '/saas/upgrade-requests',
  },

  AUTH: {
    LOGIN: '/auth/login',
  },

  SETTINGS: {
    RBAC: '/settings/rbac',
    POSITION: '/settings/position',
  },
} as const
