import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { Button, Result, Space } from 'antd'

export default function NotFoundPage() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate({ to: '.' })
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển."
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
