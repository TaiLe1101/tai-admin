import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { Button, Layout, Menu, Tooltip, Typography } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import {
  applyTooltipToMenuItems,
  filterMenuItemsByPermission,
  getOpenKeysFromPath,
  menuItems,
} from './menuItems'
import { useHasPermission } from '#/shared/hooks/useHasPermission/useHasPermission'

const { Sider } = Layout
const { Text } = Typography

interface AppSidebarProps {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  onToggle?: () => void
}

export default function AppSidebar({
  collapsed = true,
  onCollapse,
  onToggle,
}: AppSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname
  const { hasPermission } = useHasPermission()

  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else if (onCollapse) {
      onCollapse(!collapsed)
    }
  }

  const filteredMenuItems = useMemo(() => {
    const filtered = filterMenuItemsByPermission(menuItems, hasPermission)
    return collapsed ? filtered : applyTooltipToMenuItems(filtered)
  }, [hasPermission, collapsed])

  // SubMenu đang mở ở chế độ inline (sidebar mở rộng)
  const [inlineOpenKeys, setInlineOpenKeys] = useState<string[]>(() =>
    getOpenKeysFromPath(currentPath, filteredMenuItems),
  )

  // SubMenu đang mở ở chế độ popup (sidebar thu gọn)
  const [popupOpenKeys, setPopupOpenKeys] = useState<string[]>([])

  // Cập nhật SubMenu được mở rộng khi đường dẫn thay đổi hoặc menu được lọc thay đổi
  useEffect(() => {
    const parentKeys = getOpenKeysFromPath(currentPath, filteredMenuItems)
    if (parentKeys.length > 0) {
      setInlineOpenKeys((prev) => {
        const hasAllKeys = parentKeys.every((key) => prev.includes(key))
        if (hasAllKeys) return prev
        return Array.from(new Set([...prev, ...parentKeys]))
      })
    }
  }, [currentPath, filteredMenuItems])

  // Đóng popup khi trạng thái thu gọn/mở rộng sidebar thay đổi
  useEffect(() => {
    setPopupOpenKeys([])
  }, [collapsed])

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      collapsedWidth={80}
      width={250}
      trigger={null}
      theme="light"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        height: '100vh',
        zIndex: 100,
        borderRight: '1px solid #e5e7eb',
        boxShadow: '1px 0 6px 0 rgba(0, 0, 0, 0.03)',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.2s ease',
      }}
      styles={{
        body: {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        },
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0 10px' : '0 20px',
          borderBottom: '1px solid #f0f0f0',
          flexShrink: 0,
          overflow: 'hidden',
          transition: 'all 0.2s ease',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}
        >
          {/* <img
            src="/images/logo.png"
            alt="E Office Logo"
            width={40}
            height={40}
            style={{
              width: 40,
              height: 40,
              aspectRatio: '1 / 1',
              objectFit: 'contain',
              flexShrink: 0,
            }}
          /> */}
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Text
                  strong
                  style={{
                    fontSize: 16,
                    color: '#0f172a',
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  EOffice
                </Text>
              </div>
              <Text
                type="secondary"
                style={{ fontSize: 11, lineHeight: 1.2, whiteSpace: 'nowrap' }}
              >
                Hệ thống quản lý thăm/nuôi
              </Text>
            </div>
          )}
        </Link>
      </div>

      {/* Menu Đa Cấp */}
      <div
        className="sidebar-menu-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0,
          paddingTop: 8,
          paddingBottom: 16,
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[currentPath]}
          openKeys={collapsed ? popupOpenKeys : inlineOpenKeys}
          onOpenChange={(keys) => {
            if (collapsed) {
              setPopupOpenKeys(keys)
            } else {
              setInlineOpenKeys(keys)
            }
          }}
          onClick={({ key }) => {
            navigate({ to: key })
            if (collapsed) {
              setPopupOpenKeys([])
            }
          }}
          items={filteredMenuItems}
          style={{
            borderRight: 'none',
            fontSize: 14,
            fontWeight: 500,
          }}
        />
      </div>

      {/* Sidebar Footer */}
      <div
        style={{
          padding: collapsed ? '8px 4px' : '8px 12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          borderTop: '1px solid #f0f0f0',
          fontSize: 11,
          color: '#94a3b8',
          textAlign: 'center',
          flexShrink: 0,
          backgroundColor: '#fafafa',
          userSelect: 'none',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <Tooltip
          title={collapsed ? 'Mở rộng thanh điều hướng' : undefined}
          placement="right"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleToggle}
            style={{
              width: '100%',
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: `${collapsed ? "center" : 'start'}`,
              gap: 8,
            }}
            title={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
          >
            {!collapsed && <span>Thu gọn thanh điều hướng</span>}
          </Button>
        </Tooltip>

        <div className="text-[11px] text-slate-400 text-center whitespace-nowrap overflow-hidden">
          <span>{collapsed ? '© 2026' : '2B Solutions © 2026'}</span>
        </div>
      </div>
    </Sider>
  )
}
