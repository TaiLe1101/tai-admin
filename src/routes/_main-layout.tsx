import MainLayout from "@/shared/layouts/MainLayout/MainLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ROUTE } from "#/shared/constants/route";
import { store } from "#/app/store/store";
import { refreshToken } from "#/shared/api/axiosClient";
import { PageLoading } from "#/shared/components";
import { fetchMe } from "#/features/auth/queries/useGetMeQuery";
import { setProfile } from "#/features/auth/slices/profileSlice";
import { setRoles } from "#/features/auth/slices/roleSlice";
import { setPermissions } from "#/features/auth/slices/permissionSlice";

export const Route = createFileRoute("/_main-layout")({
  beforeLoad: async () => {
    const state = store.getState();
    if (!state.auth.accessToken) {
      try {
        await refreshToken()
        const resMe = await fetchMe()
        store.dispatch(setProfile({ profile: resMe.profile }))
        store.dispatch(setRoles({ roles: resMe.roles }))
        store.dispatch(setPermissions({ permissions: resMe.permissions }))
      } catch {
        throw redirect({
          to: ROUTE.AUTH.LOGIN,
        });
      }
    }
    if (!store.getState().auth.isAuthenticated) {
      throw redirect({
        to: ROUTE.AUTH.LOGIN,
      });
    }
  },
  pendingComponent: () => (
    <PageLoading fullScreen tip="Đang kiểm tra phiên làm việc..." />
  ),
  component: MainLayout,
});

