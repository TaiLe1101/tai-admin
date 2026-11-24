import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  EyeOutlined,
  LockOutlined,
  PlusOutlined,
  ReloadOutlined,
  UnlockOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Input,
  Popconfirm,
  Progress,
  Result,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import type { TableProps } from 'antd'
import { appDayJs } from '#/shared/utils/appDayjs'
import {
  getPaginationTotal,
  getPaginationTotalPages,
} from '../api/dto/saasTypes'
import type {
  TenantListItemDto,
  TenantListQuery,
  TenantStatus,
  TenantType,
} from '../api/dto/saasTypes'
import CreateTenantModal from '../components/CreateTenantModal'
import TenantDetailDrawer from '../components/TenantDetailDrawer'
import { useUpdateSaasTenant } from '../hooks/useSaasMutations'
import { useSaasPlans, useSaasTenants } from '../queries/useSaasQueries'
import {
  BILLING_CYCLE_META,
  formatMinutesLimit,
  formatUsedMinutes,
  getQuotaPercent,
  SUBSCRIPTION_STATUS_META,
  TENANT_STATUS_META,
  TENANT_TYPE_META,
} from '../utils/saasFormat'

const routeApi = getRouteApi('/_main-layout/saas/tenants/')

export default function SaasTenantsPage() {
  const params = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const [searchInput, setSearchInput] = useState(params.search ?? '')
  const [createOpen, setCreateOpen] = useState(false)
  const [detailId, setDetailId] = useState<number | null>(null)

  const plansQuery = useSaasPlans()
  const tenantsQuery = useSaasTenants(params)
  const updateTenantMutation = useUpdateSaasTenant()

  useEffect(() => {
    setSearchInput(params.search ?? '')
  }, [params.search])

  const updateSearch = (changes: Partial<TenantListQuery>) => {
    void navigate({ search: (prev) => ({ ...prev, ...changes }) })
  }

  useEffect(() => {
    if (!tenantsQuery.data || tenantsQuery.isFetching) return
    const lastPage = getPaginationTotalPages(tenantsQuery.data.pagination)
    if (params.page > lastPage) {
      void navigate({
        search: (prev) => ({ ...prev, page: lastPage }),
        replace: true,
      })
    }
  }, [tenantsQuery.data, tenantsQuery.isFetching, params.page, navigate])

  const columns: TableProps<TenantListItemDto>['columns'] = [
    {
      title: 'Tenant',
      key: 'tenant',
      width: 240,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Button
            type="link"
            style={{ padding: 0, height: 'auto', fontWeight: 600 }}
            onClick={() => setDetailId(record.id)}
          >
            {record.name}
          </Button>
          <Space size={6}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {record.code}
            </Typography.Text>
            {record.contactEmail && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                • {record.contactEmail}
              </Typography.Text>
            )}
          </Space>
        </Space>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      width: 105,
      render: (type: TenantType) => (
        <Tag color={TENANT_TYPE_META[type].color}>
          {TENANT_TYPE_META[type].label}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 115,
      render: (status: TenantStatus) => (
        <Tag color={TENANT_STATUS_META[status].color}>
          {TENANT_STATUS_META[status].label}
        </Tag>
      ),
    },
    {
      title: 'Thành viên',
      dataIndex: 'memberCount',
      width: 105,
      align: 'center',
      render: (count: number) => `${count} người`,
    },
    {
      title: 'Gói hiện tại',
      key: 'subscription',
      width: 210,
      render: (_, record) => {
        const sub = record.activeSubscription
        if (!sub) {
          return <Tag color="default">Chưa có gói</Tag>
        }
        const statusMeta = SUBSCRIPTION_STATUS_META[sub.status]
        return (
          <Space direction="vertical" size={2}>
            <Space size={4} wrap>
              <Typography.Text strong>{sub.plan.name}</Typography.Text>
              <Tag color={BILLING_CYCLE_META[sub.billingCycle].color}>
                {BILLING_CYCLE_META[sub.billingCycle].label}
              </Tag>
              {sub.status !== 'ACTIVE' && (
                <Tag color={statusMeta.color}>{statusMeta.label}</Tag>
              )}
            </Space>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              HSD:{' '}
              {sub.expiresAt
                ? appDayJs.formatVN(sub.expiresAt, 'DD/MM/YYYY')
                : 'Không hết hạn'}
            </Typography.Text>
          </Space>
        )
      },
    },
    {
      title: 'Hạn mức tháng này',
      key: 'usage',
      width: 220,
      render: (_, record) => {
        const usage = record.currentUsage
        const usedMinutes = formatUsedMinutes(
          usage.usedMinutes,
          usage.usedSeconds,
        )
        const limitMinutes = usage.limitMinutes
        const percent = getQuotaPercent(usedMinutes, limitMinutes)
        return (
          <div style={{ minWidth: 170 }}>
            <div className="flex justify-between text-xs mb-1">
              <span>
                <strong>{usedMinutes}</strong> phút
              </span>
              <span className="text-slate-500">
                / {formatMinutesLimit(limitMinutes)}
              </span>
            </div>
            {limitMinutes !== null ? (
              <Progress
                size="small"
                percent={percent}
                showInfo={false}
                status={percent >= 100 ? 'exception' : 'active'}
              />
            ) : (
              <Tag color="purple" style={{ margin: 0 }}>
                Không giới hạn
              </Tag>
            )}
          </div>
        )
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 150,
      render: (value: string) => appDayJs.formatVN(value, 'DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 160,
      fixed: 'right',
      render: (_, record) => {
        const isActive = record.status === 'ACTIVE'
        return (
          <Space size={8}>
            <Tooltip title="Xem chi tiết, gói & thành viên">
              <Button
                icon={<EyeOutlined />}
                aria-label={`Chi tiết Tenant ${record.name}`}
                onClick={() => setDetailId(record.id)}
              >
                Chi tiết
              </Button>
            </Tooltip>
            <Popconfirm
              title={
                isActive
                  ? `Tạm khóa Tenant "${record.name}"?`
                  : `Mở khóa Tenant "${record.name}"?`
              }
              description={
                isActive
                  ? 'Các thành viên thuộc Tenant này sẽ tạm thời không thể sử dụng tính năng lồng tiếng.'
                  : 'Tenant sẽ được kích hoạt hoạt động trở lại.'
              }
              okText={isActive ? 'Tạm khóa' : 'Mở khóa'}
              cancelText="Hủy"
              okButtonProps={{ danger: isActive }}
              onConfirm={() =>
                updateTenantMutation.mutateAsync({
                  id: record.id,
                  payload: { status: isActive ? 'SUSPENDED' : 'ACTIVE' },
                })
              }
            >
              <Tooltip title={isActive ? 'Khóa nhanh' : 'Mở khóa nhanh'}>
                <Button
                  danger={isActive}
                  icon={isActive ? <LockOutlined /> : <UnlockOutlined />}
                  aria-label={
                    isActive
                      ? `Khóa Tenant ${record.name}`
                      : `Mở khóa Tenant ${record.name}`
                  }
                  loading={
                    updateTenantMutation.isPending &&
                    updateTenantMutation.variables.id === record.id
                  }
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      },
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
            Quản lý Tenant
          </Typography.Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            Tạo Tenant mới
          </Button>
        </Col>
      </Row>

      <Card>
        <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
          <Col xs={24} md={8}>
            <Input.Search
              placeholder="Tìm theo tên, mã Tenant hoặc email..."
              aria-label="Tìm kiếm Tenant"
              allowClear
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onSearch={(value) =>
                updateSearch({ search: value.trim() || undefined, page: 1 })
              }
            />
          </Col>
          <Col xs={12} md={4}>
            <Select<TenantType>
              aria-label="Loại Tenant"
              placeholder="Tất cả loại"
              allowClear
              value={params.type}
              style={{ width: '100%' }}
              onChange={(type) => updateSearch({ type, page: 1 })}
              options={[
                { value: 'PERSONAL', label: 'Cá nhân' },
                { value: 'ORGANIZATION', label: 'Tổ chức' },
              ]}
            />
          </Col>
          <Col xs={12} md={4}>
            <Select<TenantStatus>
              aria-label="Trạng thái Tenant"
              placeholder="Tất cả trạng thái"
              allowClear
              value={params.status}
              style={{ width: '100%' }}
              onChange={(status) => updateSearch({ status, page: 1 })}
              options={[
                { value: 'ACTIVE', label: 'Hoạt động' },
                { value: 'SUSPENDED', label: 'Tạm khóa' },
              ]}
            />
          </Col>
          <Col xs={18} md={6}>
            <Select<number>
              aria-label="Lọc theo gói"
              placeholder="Tất cả gói dịch vụ"
              allowClear
              value={params.planId}
              style={{ width: '100%' }}
              loading={plansQuery.isLoading}
              onChange={(planId) => updateSearch({ planId, page: 1 })}
              options={(plansQuery.data ?? []).map((plan) => ({
                value: plan.id,
                label: `${plan.name} (${plan.code})`,
              }))}
            />
          </Col>
          <Col xs={6} md={2}>
            <Tooltip title="Tải lại">
              <Button
                block
                icon={<ReloadOutlined />}
                aria-label="Tải lại danh sách Tenant"
                loading={tenantsQuery.isFetching}
                onClick={() => void tenantsQuery.refetch()}
              />
            </Tooltip>
          </Col>
        </Row>

        {tenantsQuery.isError ? (
          <Result
            status="error"
            title="Không tải được danh sách Tenant"
            subTitle={tenantsQuery.error.message}
            extra={
              <Button onClick={() => void tenantsQuery.refetch()}>Thử lại</Button>
            }
          />
        ) : (
          <Table<TenantListItemDto>
            rowKey="id"
            columns={columns}
            dataSource={tenantsQuery.data?.data ?? []}
            loading={tenantsQuery.isFetching}
            scroll={{ x: 1300 }}
            locale={{ emptyText: 'Không có Tenant nào phù hợp' }}
            pagination={{
              current: params.page,
              pageSize: params.limit,
              total: getPaginationTotal(tenantsQuery.data?.pagination),
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50, 100],
              showTotal: (total) => `Tổng ${total} Tenant`,
              onChange: (page, limit) =>
                updateSearch({
                  page: limit !== params.limit ? 1 : page,
                  limit,
                }),
            }}
          />
        )}
      </Card>

      <CreateTenantModal
        open={createOpen}
        plans={plansQuery.data ?? []}
        onClose={() => setCreateOpen(false)}
        onCreated={(newTenantId) => setDetailId(newTenantId)}
      />

      <TenantDetailDrawer
        tenantId={detailId}
        plans={plansQuery.data ?? []}
        onClose={() => setDetailId(null)}
      />
    </div>
  )
}
