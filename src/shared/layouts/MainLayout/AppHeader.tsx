import { useAppSelector } from '#/app/store/hooks'
import useLogoutMutation from '#/features/auth/hooks/useLogoutMutation'
import { AppTag } from '#/shared/components/AppTag/AppTag'
import { getFullName } from '#/shared/utils/formatFullName'
import {
  ExclamationCircleOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { App, Avatar, Dropdown, Layout, Space } from 'antd'
import { ChevronDown } from 'lucide-react'

const { Header } = Layout

interface AppHeaderProps {
  collapsed?: boolean
  onToggle?: () => void
}

export default function AppHeader({
  collapsed = true,
}: AppHeaderProps) {
  const { modal } = App.useApp()
  const { profile } = useAppSelector(state => state.profile)
  const { mutate: logoutMutate, isPending: logoutPending } = useLogoutMutation();

  const handleLogout = () => {
    modal.confirm({
      title: 'Xác nhận đăng xuất',
      icon: <ExclamationCircleOutlined style={{ color: '#ef4444' }} />,
      content: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      async onOk() {
        logoutMutate()
      },
    })
  }

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      handleLogout()
    }
  }

  const displayName = getFullName({ firstName: profile?.firstName, lastName: profile?.lastName })


  const dropdownItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className='flex items-center gap-2'>
          <Avatar
            size={38}
            src={profile?.avatar || undefined}
            icon={!profile?.avatar && <UserOutlined />}
          />

          <div className='flex flex-col items-start gap-1'>
            <p className='font-semibold text-black'>{displayName}</p>
            <span className='text-[12px]'>
              Trưởng phòng IT
            </span>
          </div>
        </div>
      ),
      disabled: true,
      style: { cursor: 'default' },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      style: {
        fontWeight: 500,
      },
      disabled: logoutPending
    },
  ]

  return (
    <Header
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: collapsed ? 80 : 250,
        height: 64,
        zIndex: 99,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'left 0.2s ease',
      }}
    >
      {/* Bên trái Header */}
      <div />

      {/* Bên phải: Chuông thông báo + Cụm Dev tách riêng + Avatar và Dropdown menu */}
      <Space size={16} align="center">

        {/* <NotificationPopover /> */}
        <Dropdown
          menu={{ items: dropdownItems, onClick: handleMenuClick, }}
          trigger={['click']}
          placement="bottomRight"
        >
          <div
            style={{
              transition: 'all 0.2s',
            }}
            className='flex items-center gap-3 cursor-pointer hover:bg-neutral-100'
          >

            <Avatar
              size={28}
              src={profile?.avatar || undefined}
              icon={!profile?.avatar && <UserOutlined />}
            />

            <div className='flex flex-col items-start gap-1'>
              <p className='font-semibold'>{displayName}</p>
              <AppTag color='blue' size='small'>
                Trưởng phòng IT
              </AppTag>
            </div>

            <ChevronDown size={16} color='#646a73' />

          </div>
        </Dropdown>
      </Space>
    </Header>
  )
}
