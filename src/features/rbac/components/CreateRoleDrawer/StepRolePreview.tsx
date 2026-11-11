import { Col, Descriptions, Row, Typography } from 'antd'
import { useMemo } from 'react'
import StepRolePermissions from './StepRolePermissions'
import { MOCK_MEMBERS } from './types'
import type { RoleFormData } from './types'

interface StepRolePreviewProps {
  data: RoleFormData
}

export default function StepRolePreview({ data }: StepRolePreviewProps) {
  const assignedMemberNames = useMemo(() => {
    const matched = MOCK_MEMBERS.filter((m) =>
      data.selectedMemberIds.includes(m.id),
    )
    if (!matched.length) {
      return 'Chưa chỉ định thành viên nào'
    }
    return matched.map((m) => m.fullName).join(', ')
  }, [data.selectedMemberIds])

  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-hidden">
      {/* Thông tin vai trò & Tiêu đề: cố định, không bị cuộn */}
      <div className="shrink-0">
        <Row gutter={[0, 8]}>
          <Col span={24}>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Mã vai trò">
                {data.code || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Tên vai trò">
                {data.name || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả vai trò">
                {data.description || 'Không có mô tả'}
              </Descriptions.Item>
              <Descriptions.Item label="Thành viên được chỉ định">
                {assignedMemberNames}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          <Col span={24}>
            <Typography.Title level={5} style={{ marginBottom: 0, marginTop: 4 }}>
              Ma trận quyền đã chọn
            </Typography.Title>
          </Col>
        </Row>
      </div>

      {/* Ma trận quyền: chỉ có danh sách quyền cuộn độc lập */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <StepRolePermissions
          selectedPermissions={data.selectedPermissions}
          readOnly
        />
      </div>
    </div>
  )
}
