import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { Button, Result, Space } from 'antd'

export default function ForbiddenPage() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate({ to: '/' })
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div
      style={{
        height: '100%',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <Result
        status="403"
        title="403"
        subTitle="Bạn không có quyền truy cập vào trang này."
        extra={
          <Space size="middle">
            <Button icon={<ArrowLeftOutlined />} onClick={handleGoBack}>
              Quay lại
            </Button>
            <Button
              type="primary"
              icon={<HomeOutlined />}
              onClick={handleGoHome}
            >
              Về trang chủ
            </Button>
          </Space>
        }
      />
    </div>
  )
}
