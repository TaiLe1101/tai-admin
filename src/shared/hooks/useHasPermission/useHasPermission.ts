import { useAppSelector } from "#/app/store/hooks"

export const useHasPermission = () => {
    const { permissions } = useAppSelector(state => state.permissions);

    const hasPermission = (permission: string) => {
        return permissions.some((p) => p.code === permission);
    }

    return { hasPermission }
}