import { useState } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  StarFilled,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Popconfirm,
  Result,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import type { TableProps } from 'antd'
import type { PlanDto } from '../api/dto/saasTypes'
import PlanFormDrawer from '../components/PlanFormDrawer'
import { useDeleteSaasPlan } from '../hooks/useSaasMutations'
import { useSaasPlans } from '../queries/useSaasQueries'
import { formatMinutesLimit, formatPlanPrice } from '../utils/saasFormat'

export default function SaasPlansPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PlanDto | null>(null)
  const plansQuery = useSaasPlans()
  const deleteMutation = useDeleteSaasPlan()

  const openCreate = () => {
    setEditingPlan(null)
    setDrawerOpen(true)
  }

  const openEdit = (plan: PlanDto) => {
    setEditingPlan(plan)
    setDrawerOpen(true)
  }

  const columns: TableProps<PlanDto>['columns'] = [
    {
      title: 'Thứ tự',
      dataIndex: 'sortOrder',
      width: 75,
      align: 'center',
    },
    {
      title: 'Tên gói & Mã',
      key: 'name',
      width: 240,
      render: (_, plan) => (
        <Space direction="vertical" size={2}>
          <Space size={6} wrap>
            <Typography.Text strong>{plan.name}</Typography.Text>
            <Tag>{plan.code}</Tag>
            {plan.badge && <Tag color="blue">{plan.badge}</Tag>}
          </Space>
          <Space size={4} wrap>
            {plan.isDefault && <Tag color="green">Mặc định</Tag>}
            {plan.isHighlighted && (
              <Tag color="gold" icon={<StarFilled />}>
                Nổi bật
              </Tag>
            )}
          </Space>
        </Space>
      ),
    },
    {
      title: 'Giá tháng / năm',
      key: 'pricing',
      width: 190,
      render: (_, plan) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>
            {formatPlanPrice(plan.priceMonthly, plan.currency)} / tháng
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {formatPlanPrice(plan.priceYearly, plan.currency)} / năm
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Hạn mức / tháng',
      dataIndex: 'monthlyMinutesLimit',
      width: 150,
      render: (limit: number | null) => (
        <Tag color={limit === null ? 'purple' : 'cyan'}>
          {formatMinutesLimit(limit)}
        </Tag>
      ),
    },
    {
      title: 'Thành viên',
      dataIndex: 'maxSeats',
      width: 110,
      align: 'center',
      render: (seats: number) => `${seats} người`,
    },
    {
      title: 'Tính năng',
      dataIndex: 'features',
      render: (features: string[]) =>
        features.length === 0 ? (
          <Typography.Text type="secondary">—</Typography.Text>
        ) : (
          <Tooltip
            title={
              <ul className="pl-4 m-0 list-disc">
                {features.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            }
          >
            <Space direction="vertical" size={0}>
              <Typography.Text ellipsis style={{ maxWidth: 260 }}>
                • {features[0]}
              </Typography.Text>
              {features.length > 1 && (
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  +{features.length - 1} tính năng khác
                </Typography.Text>
              )}
            </Space>
          </Tooltip>
        ),
    },
    {
      title: 'Trạng thái',
      key: 'flags',
      width: 150,
      render: (_, plan) => (
        <Space size={4} wrap>
          <Tag color={plan.isActive ? 'green' : 'red'}>
            {plan.isActive ? 'Kích hoạt' : 'Tắt'}
          </Tag>
          <Tag color={plan.isPublic ? 'blue' : 'default'}>
            {plan.isPublic ? 'Công khai' : 'Nội bộ'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      fixed: 'right',
      align: 'right',
      render: (_, plan) => (
        <Space size={8}>
          <Tooltip title="Chỉnh sửa gói">
            <Button
              icon={<EditOutlined />}
              aria-label={`Chỉnh sửa gói ${plan.name}`}
              onClick={() => openEdit(plan)}
            />
          </Tooltip>
          <Popconfirm
            title={`Xóa gói "${plan.name}"?`}
            description="Không thể xóa nếu vẫn còn Tenant đang sử dụng gói này."
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            disabled={deleteMutation.isPending}
            onConfirm={() => deleteMutation.mutateAsync(plan.id)}
          >
            <Tooltip title="Xóa gói">
              <Button
                danger
                icon={<DeleteOutlined />}
                aria-label={`Xóa gói ${plan.name}`}
                loading={
                  deleteMutation.isPending &&
                  deleteMutation.variables === plan.id
                }
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="h-full overflow-y-auto pr-1">
      <Row
        gutter={[8, 8]}
        align="middle"
        justify="space-between"
        style={{ marginBottom: 12 }}
      >
        <Col>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Quản lý gói dịch vụ
          </Typography.Title>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              loading={plansQuery.isFetching}
              onClick={() => void plansQuery.refetch()}
            >
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Tạo gói mới
            </Button>
          </Space>
        </Col>
      </Row>

      <Card>
        {plansQuery.isError ? (
          <Result
            status="error"
            title="Không tải được danh sách gói dịch vụ"
            subTitle={plansQuery.error.message}
            extra={
              <Button onClick={() => void plansQuery.refetch()}>Thử lại</Button>
            }
          />
        ) : (
          <Table<PlanDto>
            rowKey="id"
            columns={columns}
            dataSource={plansQuery.data ?? []}
            loading={plansQuery.isFetching}
            pagination={false}
            scroll={{ x: 1120 }}
            locale={{ emptyText: 'Chưa có gói dịch vụ nào' }}
          />
        )}
      </Card>

      <PlanFormDrawer
        open={drawerOpen}
        plan={editingPlan}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}
