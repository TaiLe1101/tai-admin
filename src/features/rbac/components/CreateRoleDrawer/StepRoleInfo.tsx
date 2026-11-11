import { Col, Form, Input, Row } from 'antd'
import type { RoleFormData } from './types'

interface StepRoleInfoProps {
  data: RoleFormData
  onChange: <K extends keyof RoleFormData>(field: K, value: RoleFormData[K]) => void
}

export default function StepRoleInfo({ data, onChange }: StepRoleInfoProps) {
  return (
    <div className="w-full h-full overflow-y-auto pr-1">
      <Form layout="vertical">
        <Row gutter={[0, 8]}>
          <Col span={24}>
            <Form.Item label="Mã vai trò" required>
              <Input
                placeholder="Nhập mã vai trò"
                value={data.code}
                onChange={(e) => onChange('code', e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Tên vai trò" required>
              <Input
                placeholder="Nhập tên vai trò"
                value={data.name}
                onChange={(e) => onChange('name', e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Mô tả vai trò">
              <Input.TextArea
                placeholder="Nhập mô tả vai trò"
                rows={4}
                value={data.description}
                onChange={(e) => onChange('description', e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
