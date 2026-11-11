import { type PermissionCode } from '#/shared/constants/permissions'
import { ROUTE } from '#/shared/constants/route'
import { DashboardOutlined, SettingOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Tooltip } from 'antd'
import { AlignStartVertical, Building, Settings2, UserKey, UserShield } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export type AppMenuItem = Required<MenuProps>['items'][number] & {
  permission?: PermissionCode
  children?: AppMenuItem[]
}

export type MenuItem = AppMenuItem

/**
 * Component hiển thị nhãn menu và tự động bật Ant Design Tooltip khi văn bản bị tràn/che (ellipsized)
 */
export function MenuLabelWithTooltip({ text }: { text: string }) {
  const textRef = useRef<HTMLSpanElement>(null)
  const [isOverflowed, setIsOverflowed] = useState<boolean>(false)

  const checkOverflow = () => {
    const el = textRef.current
    if (el) {
      // scrollWidth > clientWidth + 1 để kiểm tra văn bản có bị che không
      setIsOverflowed(el.scrollWidth > el.clientWidth + 1)
    }
  }

  useEffect(() => {
    checkOverflow()
    const el = textRef.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => {
      checkOverflow()
    })
    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [text])

  return (
    <Tooltip title={isOverflowed ? text : undefined} placement="right">
      <span
        ref={textRef}
        onMouseEnter={checkOverflow}
        className="inline-block max-w-full truncate align-bottom"
      >
        {text}
      </span>
    </Tooltip>
  )
}

export const menuItems: AppMenuItem[] = [
  {
    key: ROUTE.DASHBOARD,
    icon: <DashboardOutlined />,
    label: 'Tổng quan',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Cài đặt',
    children: [
      {
        key: ROUTE.SETTINGS.RBAC,
        label: 'Vai trò hệ thống & quyền',
        icon: <UserShield size={16} />,
      },
      {
        key: "company",
        label: "Tổ chức",
        icon: <Building size={16} />,
        children: [
          {
            key: "#",
            label: "Tài khoản",
            icon: <UserKey size={16} />
          },
          {
            key: ROUTE.SETTINGS.POSITION,
            label: "Vị trí chức danh",
            icon: <AlignStartVertical size={16} />
          },
        ]
      },
      {
        key: "#",
        label: "Tùy chỉnh",
        icon: <Settings2 size={16} />
      },
    ],
  },
]

/**
 * Tự động gắn MenuLabelWithTooltip cho tất cả các mục menu có label dạng chuỗi
 * và vô hiệu hóa title native của browser
 */
export function applyTooltipToMenuItems(items: AppMenuItem[]): AppMenuItem[] {
  return items.map((item) => {
    if (!item) return item

    // Nếu là divider thì không có label, giữ nguyên
    if ('type' in item && item.type === 'divider') {
      return item
    }

    if ('label' in item) {
      const rawLabel = typeof item.label === 'string' ? item.label : undefined
      const labelNode = rawLabel ? (
        <MenuLabelWithTooltip text={rawLabel} />
      ) : (
        item.label
      )

      const newItem = {
        ...item,
        label: labelNode,
        title: '',
      }

      if ('children' in item && item.children && Array.isArray(item.children)) {
        newItem.children = applyTooltipToMenuItems(item.children)
      }

      return newItem as AppMenuItem
    }

    return item
  })
}

/**
 * Lọc đệ quy danh sách menu dựa theo quyền hạn của tài khoản
 * - Nếu mục menu có khai báo permission, kiểm tra hasPermission(permission).
 * - Nếu mục menu có children: đệ quy lọc các con. Nếu sau khi lọc, toàn bộ con đều rỗng -> ẩn luôn menu cha (tự động cắt tỉa).
 * - Nếu không khai báo permission (hoặc thỏa mãn quyền) -> hiển thị.
 */
export function filterMenuItemsByPermission(
  items: AppMenuItem[],
  hasPermissionFn: (perm: PermissionCode) => boolean,
): AppMenuItem[] {
  return items.reduce<AppMenuItem[]>((acc, item) => {
    if (!item) return acc

    // 1. Kiểm tra quyền của chính menu item (nếu có khai báo)
    if ('permission' in item && item.permission && !hasPermissionFn(item.permission)) {
      return acc
    }

    // 2. Nếu có menu con, đệ quy lọc các con
    if ('children' in item && item.children && Array.isArray(item.children)) {
      const filteredChildren = filterMenuItemsByPermission(
        item.children,
        hasPermissionFn,
      )
      // Nếu là menu cha nhưng tất cả menu con đều bị ẩn -> Ẩn luôn menu cha
      if (filteredChildren.length === 0) {
        return acc
      }
      acc.push({ ...item, children: filteredChildren } as AppMenuItem)
      return acc
    }

    acc.push(item)
    return acc
  }, [])
}

/**
 * Tìm các khóa cha (parent keys) để tự động mở rộng SubMenu khi truy cập route tương ứng
 */
export function getOpenKeysFromPath(
  pathname: string,
  items: AppMenuItem[] = menuItems,
): string[] {
  for (const item of items) {
    if (item && 'children' in item && item.children && Array.isArray(item.children)) {
      const match = item.children.some((child) => child && child.key === pathname)
      if (match) {
        return [item.key as string]
      }
      const nested = getOpenKeysFromPath(pathname, item.children)
      if (nested.length > 0) {
        return [item.key as string, ...nested]
      }
    }
  }
  return []
}
