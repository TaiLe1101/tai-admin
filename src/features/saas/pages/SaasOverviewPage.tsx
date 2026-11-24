import { Link } from '@tanstack/react-router'
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  ReloadOutlined,
  RiseOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Empty,
  Progress,
  Result,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { TableProps } from 'antd'
import { ROUTE } from '#/shared/constants/route'
import { appDayJs } from '#/shared/utils/appDayjs'
import type { UpgradeRequestDto } from '../api/dto/saasTypes'
import {
  useSaasOverview,
  useSaasUpgradeRequests,
} from '../queries/useSaasQueries'
import {
  BILLING_CYCLE_META,
  formatSaasUserName,
  UPGRADE_REQUEST_STATUS_META,
} from '../utils/saasFormat'

export default function SaasOverviewPage() {
  const overviewQuery = useSaasOverview()
  const recentRequestsQuery = useSaasUpgradeRequests({
    page: 1,
    limit: 6,
  })

  const overview = overviewQuery.data
  const totalDistCount =
    overview?.planDistribution.reduce((sum, item) => sum + item.count, 0) ?? 0

  const requestColumns: TableProps<UpgradeRequestDto>['columns'] = [
    {
      title: 'Tenant / Người gửi',
      key: 'tenant',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>
            {record.tenant?.name ?? `Tenant #${record.tenantId}`}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {formatSaasUserName(record.user)}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Gói yêu cầu',
      key: 'plan',
      render: (_, record) => (
        <Space size={6} wrap>
          <Typography.Text strong>
            {record.requestedPlan?.name ?? `Plan #${record.requestedPlanId}`}
          </Typography.Text>
          <Tag color={BILLING_CYCLE_META[record.billingCycle].color}>
            {BILLING_CYCLE_META[record.billingCycle].label}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 115,
      render: (status: UpgradeRequestDto['status']) => {
        const meta = UPGRADE_REQUEST_STATUS_META[status]
        return <Tag color={meta.color}>{meta.label}</Tag>
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      width: 145,
      render: (val: string) => appDayJs.formatVN(val, 'DD/MM/YYYY HH:mm'),
    },
  ]

  const handleRefresh = () => {
    void overviewQuery.refetch()
    void recentRequestsQuery.refetch()
  }

  return (
    <div className="h-full overflow-y-auto pr-1">
      <Row
        gutter={[8, 8]}
        align="middle"
        justify="space-between"
        style={{ marginBottom: 12 }}
      >
        <Col>
          <Space align="center" size={10}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Tổng quan SaaS
            </Typography.Title>
            {overview?.currentPeriod && (
              <Tag color="blue">Kỳ {overview.currentPeriod}</Tag>
            )}
          </Space>
        </Col>
        <Col>
          <Space wrap>
            <Link to={ROUTE.SAAS.PLANS}>
              <Button icon={<CrownOutlined />}>Quản lý gói</Button>
            </Link>
            <Link to={ROUTE.SAAS.TENANTS} search={{ page: 1, limit: 20 }}>
              <Button icon={<TeamOutlined />}>Quản lý Tenant</Button>
            </Link>
            <Button
              icon={<ReloadOutlined />}
              loading={overviewQuery.isFetching || recentRequestsQuery.isFetching}
              onClick={handleRefresh}
            >
              Tải lại
            </Button>
          </Space>
        </Col>
      </Row>

      {overviewQuery.isLoading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : overviewQuery.isError ? (
        <Result
          status="error"
          title="Không tải được dữ liệu tổng quan SaaS"
          subTitle={overviewQuery.error.message}
          extra={<Button onClick={handleRefresh}>Thử lại</Button>}
        />
      ) : overview ? (
        <div className="flex flex-col gap-4">
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small" hoverable>
                <Statistic
                  title="Tổng số Tenant"
                  value={overview.totalTenants}
                  prefix={<TeamOutlined style={{ color: '#2563eb' }} />}
                />
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <Tag color="green" style={{ margin: 0 }}>
                    {overview.activeTenants} hoạt động
                  </Tag>
                  <Tag color="red" style={{ margin: 0 }}>
                    {overview.suspendedTenants} tạm khóa
                  </Tag>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card size="small" hoverable>
                <Statistic
                  title="Gói đang hoạt động"
                  value={overview.activeSubscriptions}
                  prefix={<CheckCircleOutlined style={{ color: '#16a34a' }} />}
                />
                <div className="mt-2 text-xs text-slate-500">
                  Tổng người dùng hệ thống:{' '}
                  <strong>
                    {new Intl.NumberFormat('vi-VN').format(overview.totalUsers)}
                  </strong>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card size="small" hoverable>
                <Statistic
                  title={`Phút dịch tháng ${overview.currentPeriod}`}
                  value={Math.round(overview.totalUsedMinutesThisMonth * 10) / 10}
                  suffix="phút"
                  prefix={<ThunderboltOutlined style={{ color: '#9333ea' }} />}
                />
                <div className="mt-2 text-xs text-slate-500">
                  Tổng thời lượng lồng tiếng toàn hệ thống
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card size="small" hoverable>
                <Statistic
                  title="Yêu cầu nâng cấp chờ duyệt"
                  value={overview.pendingUpgradeRequests}
                  prefix={
                    <ClockCircleOutlined
                      style={{
                        color:
                          overview.pendingUpgradeRequests > 0
                            ? '#d97706'
                            : '#64748b',
                      }}
                    />
                  }
                />
                <div className="mt-2">
                  <Link
                    to={ROUTE.SAAS.UPGRADE_REQUESTS}
                    search={{ page: 1, limit: 20, status: 'PENDING' }}
                    className="text-xs inline-flex items-center gap-1"
                  >
                    Xử lý ngay <ArrowRightOutlined />
                  </Link>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[12, 12]}>
            <Col xs={24} lg={10}>
              <Card
                title={
                  <Space>
                    <CrownOutlined />
                    <span>Phân bố Tenant theo gói</span>
                  </Space>
                }
                extra={
                  <Link to={ROUTE.SAAS.PLANS}>
                    <Button type="link" size="small">
                      Cấu hình gói
                    </Button>
                  </Link>
                }
              >
                {overview.planDistribution.length === 0 ? (
                  <Empty description="Chưa có dữ liệu phân bố gói" />
                ) : (
                  <div className="flex flex-col gap-4">
                    {overview.planDistribution.map((item) => {
                      const percent =
                        totalDistCount > 0
                          ? Math.round((item.count / totalDistCount) * 100)
                          : 0
                      return (
                        <div key={item.planId}>
                          <div className="flex items-center justify-between mb-1">
                            <Space size={6}>
                              <Typography.Text strong>
                                {item.name}
                              </Typography.Text>
                              <Tag>{item.code}</Tag>
                            </Space>
                            <Typography.Text type="secondary">
                              <strong>{item.count}</strong> Tenant ({percent}%)
                            </Typography.Text>
                          </div>
                          <Progress percent={percent} showInfo={false} />
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={14}>
              <Card
                title={
                  <Space>
                    <RiseOutlined />
                    <span>Yêu cầu nâng cấp mới nhất</span>
                  </Space>
                }
                extra={
                  <Link
                    to={ROUTE.SAAS.UPGRADE_REQUESTS}
                    search={{ page: 1, limit: 20 }}
                  >
                    <Button type="link" size="small">
                      Xem tất cả <ArrowRightOutlined />
                    </Button>
                  </Link>
                }
              >
                <Table<UpgradeRequestDto>
                  size="small"
                  rowKey="id"
                  columns={requestColumns}
                  dataSource={recentRequestsQuery.data?.data ?? []}
                  loading={recentRequestsQuery.isFetching}
                  pagination={false}
                  scroll={{ x: 540 }}
                  locale={{ emptyText: 'Chưa có yêu cầu nâng cấp nào' }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      ) : null}
    </div>
  )
}
