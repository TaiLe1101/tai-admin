import { useGetMeQuery } from '#/features/auth/queries/useGetMeQuery'
import { PageLoading } from '#/shared/components'
import { Outlet } from '@tanstack/react-router'
import { Layout } from 'antd'
import { useState } from 'react'
import AppHeader from './AppHeader'
import AppSidebar from './AppSidebar'

const { Content } = Layout

export default function MainLayout() {
  const { data: user, isLoading } = useGetMeQuery()

  // Sidebar mặc định thu gọn lại (collapsed = true)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved =
      typeof window !== 'undefined'
        ? localStorage.getItem('sidebar_collapsed')
        : null
    return saved !== null ? saved === 'true' : true
  })

  const handleToggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebar_collapsed', String(next))
      }
      return next
    })
  }

  const handleCollapse = (value: boolean) => {
    setCollapsed(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_collapsed', String(value))
    }
  }

  // Khi reload web (F5), hiển thị PageLoading trong lúc gọi /me để lấy thông tin và quyền hạn
  if (isLoading && !user) {
    return <PageLoading tip="Đang tải thông tin người dùng..." />
  }

  const sidebarWidth = collapsed ? 80 : 250

  return (
      <div className="relative h-screen w-screen overflow-hidden">
        {/* Lớp hình nền bg-1.png blur nhẹ toàn màn hình ứng dụng */}
        <div className="absolute inset-0 bg-app-blur pointer-events-none" />
        {/* Lớp phủ sáng nhẹ giúp các bảng biểu và dữ liệu rõ ràng, dịu mắt */}
        <div className="absolute inset-0 bg-slate-100/40 pointer-events-none" />

        <Layout
          style={{
            position: 'relative',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: 'transparent',
          }}
        >
          {/* Sidebar cố định bên trái, mặc định thu gọn */}
          <AppSidebar
            collapsed={collapsed}
            onCollapse={handleCollapse}
            onToggle={handleToggle}
          />

          {/* Vùng chính với Header cố định và Content */}
          <Layout
            style={{
              marginLeft: sidebarWidth,
              height: '100vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.2s ease',
              backgroundColor: 'transparent',
            }}
          >
            <AppHeader collapsed={collapsed} />

            <Content
              style={{
                marginTop: 64,
                padding: 16,
                height: 'calc(100vh - 64px)',
                overflow: 'hidden',
              }}
            >
              <div className="h-full bg-white/95 backdrop-blur-xs p-4 overflow-hidden rounded-lg shadow-xs">
                <Outlet />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
  )
}
