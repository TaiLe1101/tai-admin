import { useLoginMutation } from '#/features/auth/hooks/useLoginMutation'
import { HeartFilled, LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, Row, Typography } from 'antd'

const { Title, Text } = Typography

interface LoginFormValues {
  username: string
  password: string
}

export default function LoginPage() {
  const { mutate: loginMutate, isPending: isLoginPending } = useLoginMutation()

  const handleLogin = (values: LoginFormValues) => {
    loginMutate(values)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background layer blur nhẹ */}
      <div className="absolute inset-0 bg-app-blur pointer-events-none" />
      {/* Overlay mờ nhẹ giúp form đăng nhập tăng độ tương phản */}
      <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />

      {/* Nội dung form login */}
      <div className="relative z-10 w-full p-4">
        <Row justify="center" align="middle" className="w-full">
          <Col xs={24} sm={18} md={12} lg={8} xl={6} style={{ maxWidth: 420, width: '100%' }}>
            <Card
              styles={{
                body: {
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {/* Header: Title */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-sky-600 to-sky-700 flex items-center justify-center text-white text-2xl shadow-md mx-auto mb-3">
                  <HeartFilled />
                </div>
                <Title level={3} style={{ marginBottom: 4, color: '#0f172a' }}>
                  TAI
                </Title>
                <Text type="secondary">
                  Quản lý TAI
                </Text>
              </div>

              {/* Form Login */}
              <Form<LoginFormValues>
                name="login"
                layout="vertical"
                onFinish={handleLogin}
                autoComplete="off"
                requiredMark={false}
              >
                <Form.Item
                  label="Tên tài khoản"
                  name="username"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên tài khoản' },
                    { whitespace: true, message: 'Tên tài khoản không được để trống' },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                    placeholder="Nhập tên tài khoản"
                    size="large"
                    allowClear
                  />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                    placeholder="Nhập mật khẩu"
                    size="large"
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={isLoginPending}
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
