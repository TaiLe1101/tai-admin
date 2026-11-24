import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  StopOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  Input,
  Popconfirm,
  Result,
  Row,
  Segmented,
  Space,
  Statistic,
  Table,
  Tabs,
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
  PaymentOrderDto,
  PaymentOrderStatus,
  PaymentPaidSource,
  SaasPaymentsRouteSearch,
  SaasPaymentsTab,
  SepayEventStatus,
  SepayWebhookEventAdminDto,
} from '../api/dto/saasTypes'
import {
  useCancelSaasPaymentOrder,
  useReconcileSaasPaymentOrder,
  useRunSaasPaymentsReconcile,
} from '../hooks/useSaasMutations'
import {
  useSaasPaymentEvents,
  useSaasPaymentOrders,
  useSaasPaymentsSummary,
} from '../queries/useSaasQueries'
import {
  BILLING_CYCLE_META,
  formatPlanPrice,
  formatUnmatchedReason,
  PAYMENT_ORDER_STATUS_META,
  PAYMENT_PAID_SOURCE_META,
  SEPAY_EVENT_STATUS_META,
} from '../utils/saasFormat'

const routeApi = getRouteApi('/_main-layout/saas/payments/')

type OrderStatusFilter = 'ALL' | PaymentOrderStatus
type EventStatusFilter = 'ALL' | SepayEventStatus

export default function SaasPaymentsPage() {
  const params = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const [searchInput, setSearchInput] = useState(params.search ?? '')

  const summaryQuery = useSaasPaymentsSummary()
  const ordersQuery = useSaasPaymentOrders(
    {
      page: params.page,
      limit: params.limit,
      status: params.orderStatus,
      search: params.search,
    },
    params.tab === 'orders',
  )
  const eventsQuery = useSaasPaymentEvents(
    {
      page: params.page,
      limit: params.limit,
      status: params.eventStatus,
      search: params.search,
    },
    params.tab === 'events',
  )

  const cancelOrderMutation = useCancelSaasPaymentOrder()
  const reconcileOrderMutation = useReconcileSaasPaymentOrder()
  const runReconcileMutation = useRunSaasPaymentsReconcile()

  useEffect(() => {
    setSearchInput(params.search ?? '')
  }, [params.search])

  const updateSearch = (changes: Partial<SaasPaymentsRouteSearch>) => {
    void navigate({ search: (prev) => ({ ...prev, ...changes }) })
  }

  useEffect(() => {
    const activeData =
      params.tab === 'orders' ? ordersQuery.data : eventsQuery.data
    const isFetching =
      params.tab === 'orders' ? ordersQuery.isFetching : eventsQuery.isFetching
    if (!activeData || isFetching) return
    const lastPage = getPaginationTotalPages(activeData.pagination)
    if (params.page > lastPage) {
      void navigate({
        search: (prev) => ({ ...prev, page: lastPage }),
        replace: true,
      })
    }
  }, [
    params.tab,
    params.page,
    ordersQuery.data,
    ordersQuery.isFetching,
    eventsQuery.data,
    eventsQuery.isFetching,
    navigate,
  ])

  const handleRefreshAll = () => {
    void summaryQuery.refetch()
    if (params.tab === 'orders') {
      void ordersQuery.refetch()
    } else {
      void eventsQuery.refetch()
    }
  }

  const summary = summaryQuery.data

  const orderColumns: TableProps<PaymentOrderDto>['columns'] = [
    {
      title: 'Mã thanh toán',
      dataIndex: 'paymentCode',
      width: 170,
      render: (code: string, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong copyable>
            {code}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {record.bankCode}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Tenant',
      key: 'tenant',
      width: 210,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>
            {record.tenant?.name ?? `Tenant #${record.tenantId}`}
          </Typography.Text>
          {record.tenant?.code && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {record.tenant.code}
            </Typography.Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Gói & Chu kỳ',
      key: 'plan',
      width: 190,
      render: (_, record) => (
        <Space size={6} wrap>
          <Typography.Text strong>
            {record.plan?.name ?? `Plan #${record.planId}`}
          </Typography.Text>
          <Tag color={BILLING_CYCLE_META[record.billingCycle].color}>
            {BILLING_CYCLE_META[record.billingCycle].label}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Số tiền (VND)',
      dataIndex: 'amount',
      width: 150,
      align: 'right',
      render: (amount: number, record) => (
        <Space direction="vertical" size={0} align="end">
          <Typography.Text strong>
            {formatPlanPrice(amount, record.currency)}
          </Typography.Text>
          {record.paidAmount !== null && record.paidAmount !== amount && (
            <Typography.Text type="warning" style={{ fontSize: 12 }}>
              Thực nhận: {formatPlanPrice(record.paidAmount, record.currency)}
            </Typography.Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 135,
      render: (status: PaymentOrderStatus) => {
        const meta = PAYMENT_ORDER_STATUS_META[status]
        return <Tag color={meta.color}>{meta.label}</Tag>
      },
    },
    {
      title: 'Nguồn xác nhận',
      dataIndex: 'paidSource',
      width: 130,
      render: (source: PaymentPaidSource | null) => {
        if (!source) return <Typography.Text type="secondary">—</Typography.Text>
        const meta = PAYMENT_PAID_SOURCE_META[source]
        return <Tag color={meta.color}>{meta.label}</Tag>
      },
    },
    {
      title: 'Mã tham chiếu NH',
      dataIndex: 'paidReferenceCode',
      width: 170,
      render: (ref: string | null) =>
        ref ? (
          <Typography.Text code copyable>
            {ref}
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">—</Typography.Text>
        ),
    },
    {
      title: 'Thanh toán / Hết hạn',
      key: 'timing',
      width: 175,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          {record.paidAt ? (
            <Typography.Text style={{ fontSize: 12 }}>
              TT: {appDayJs.formatVN(record.paidAt, 'DD/MM/YYYY HH:mm')}
            </Typography.Text>
          ) : (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Hết hạn: {appDayJs.formatVN(record.expiresAt, 'DD/MM/YYYY HH:mm')}
            </Typography.Text>
          )}
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            Tạo: {appDayJs.formatVN(record.createdAt, 'DD/MM/YYYY HH:mm')}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 195,
      fixed: 'right',
      render: (_, record) => {
        const canReconcile =
          record.status === 'PENDING' || record.status === 'EXPIRED'
        const canCancel = record.status === 'PENDING'
        const isReconcilingThis =
          reconcileOrderMutation.isPending &&
          reconcileOrderMutation.variables === record.id
        const isCancelingThis =
          cancelOrderMutation.isPending &&
          cancelOrderMutation.variables === record.id

        return (
          <Space size={6}>
            <Tooltip
              title={
                canReconcile
                  ? 'Kiểm tra giao dịch trực tiếp qua SePay API v2'
                  : 'Chỉ đối soát đơn đang chờ hoặc vừa hết hạn'
              }
            >
              <Button
                size="small"
                icon={<SyncOutlined />}
                disabled={!canReconcile}
                loading={isReconcilingThis}
                onClick={() => void reconcileOrderMutation.mutateAsync(record.id)}
              >
                Đối soát đơn
              </Button>
            </Tooltip>
            {canCancel && (
              <Popconfirm
                title={`Hủy đơn thanh toán ${record.paymentCode}?`}
                description="Đơn sẽ chuyển sang trạng thái Đã hủy và mã QR không còn hiệu lực."
                okText="Hủy đơn"
                cancelText="Đóng"
                okButtonProps={{ danger: true }}
                onConfirm={() => cancelOrderMutation.mutateAsync(record.id)}
              >
                <Tooltip title="Hủy đơn đang chờ">
                  <Button
                    danger
                    size="small"
                    icon={<StopOutlined />}
                    loading={isCancelingThis}
                  >
                    Hủy
                  </Button>
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        )
      },
    },
  ]

  const eventColumns: TableProps<SepayWebhookEventAdminDto>['columns'] = [
    {
      title: 'SePay Webhook ID',
      dataIndex: 'sepayWebhookId',
      width: 155,
      render: (id: string, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text code>{id}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            {record.transactionDate}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Ngân hàng & STK',
      key: 'bank',
      width: 175,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{record.gateway}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            STK: {record.maskedAccountNumber}
            {record.subAccount ? ` (VA: ${record.subAccount})` : ''}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Mã thanh toán (code)',
      key: 'code',
      width: 165,
      render: (_, record) => {
        const displayCode = record.code || record.paymentCode
        return displayCode ? (
          <Typography.Text strong copyable>
            {displayCode}
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">Không có mã</Typography.Text>
        )
      },
    },
    {
      title: 'Số tiền & Loại',
      key: 'amount',
      width: 165,
      align: 'right',
      render: (_, record) => (
        <Space direction="vertical" size={2} align="end">
          <Typography.Text strong>
            {formatPlanPrice(record.transferAmount, 'VND')}
          </Typography.Text>
          <Tag
            color={record.transferType === 'in' ? 'green' : 'volcano'}
            style={{ margin: 0 }}
          >
            {record.transferType === 'in' ? 'Tiền vào (in)' : 'Tiền ra (out)'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Mã tham chiếu',
      dataIndex: 'referenceCode',
      width: 165,
      render: (ref: string | null) =>
        ref ? (
          <Typography.Text code copyable>
            {ref}
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">—</Typography.Text>
        ),
    },
    {
      title: 'Xác thực tự động',
      dataIndex: 'verdict',
      width: 130,
      render: (verdict: boolean) => (
        <Tag color={verdict ? 'green' : 'red'}>
          {verdict ? 'Thành công' : 'Thất bại'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái & Lý do cần đối soát',
      key: 'status',
      width: 260,
      render: (_, record) => {
        const meta = SEPAY_EVENT_STATUS_META[record.status]
        return (
          <Space direction="vertical" size={2}>
            <Tag color={meta.color}>{meta.label}</Tag>
            {record.unmatchedReason && (
              <Typography.Text type="warning" style={{ fontSize: 12 }}>
                {formatUnmatchedReason(record.unmatchedReason)}
              </Typography.Text>
            )}
          </Space>
        )
      },
    },
    {
      title: 'Nhận lúc',
      dataIndex: 'createdAt',
      width: 145,
      render: (val: string) => appDayJs.formatVN(val, 'DD/MM/YYYY HH:mm'),
    },
  ]

  const currentOrderStatus: OrderStatusFilter = params.orderStatus ?? 'ALL'
  const currentEventStatus: EventStatusFilter = params.eventStatus ?? 'ALL'

  return (
    <div className="h-full overflow-y-auto pr-1">
      <Row
        gutter={[8, 8]}
        align="middle"
        justify="space-between"
        style={{ marginBottom: 12 }}
      >
        <Col>
          <Space align="center" size={8} wrap>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Thanh toán SePay
            </Typography.Title>
            {summary && (
              <>
                <Tag
                  color={summary.env === 'production' ? 'green' : 'orange'}
                  style={{ margin: 0 }}
                >
                  {summary.env === 'production' ? 'Production' : 'Sandbox'}
                </Tag>
                <Tag
                  color={summary.enabled ? 'blue' : 'default'}
                  style={{ margin: 0 }}
                >
                  {summary.enabled ? 'SePay đang bật' : 'Chưa cấu hình SePay'}
                </Tag>
              </>
            )}
          </Space>
        </Col>
        <Col>
          <Space wrap>
            <Button
              icon={<ReloadOutlined />}
              loading={
                summaryQuery.isFetching ||
                ordersQuery.isFetching ||
                eventsQuery.isFetching
              }
              onClick={handleRefreshAll}
            >
              Tải lại
            </Button>
            <Button
              type="primary"
              icon={<SyncOutlined />}
              loading={runReconcileMutation.isPending}
              onClick={() => void runReconcileMutation.mutateAsync()}
            >
              Chạy đối soát SePay ngay
            </Button>
          </Space>
        </Col>
      </Row>

      {summary && !summary.enabled && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 12 }}
          message="SePay chưa được cấu hình đầy đủ trên máy chủ"
          description="Cấu hình SEPAY_BANK_CODE, SEPAY_ACCOUNT_NUMBER, SEPAY_WEBHOOK_SECRET và SEPAY_API_TOKEN trên backend để bật VietQR tự động và đối soát SePay API v2."
        />
      )}

      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" loading={summaryQuery.isLoading}>
            <Statistic
              title="Đơn đã thanh toán (PAID)"
              value={summary?.paidOrders ?? 0}
              prefix={<CheckCircleOutlined style={{ color: '#16a34a' }} />}
            />
            <div className="mt-1 text-xs text-slate-500">
              Kích hoạt gói tự động qua Webhook / Đối soát
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card size="small" loading={summaryQuery.isLoading}>
            <Statistic
              title="Đơn đang chờ (PENDING)"
              value={summary?.pendingOrders ?? 0}
              prefix={<ClockCircleOutlined style={{ color: '#d97706' }} />}
            />
            <div className="mt-1 text-xs text-slate-500">
              Mã VietQR đang có hiệu lực chờ chuyển khoản
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            size="small"
            hoverable
            loading={summaryQuery.isLoading}
            onClick={() =>
              updateSearch({
                tab: 'events',
                eventStatus: 'UNMATCHED',
                page: 1,
              })
            }
          >
            <Statistic
              title="Giao dịch cần kiểm tra / hoàn tiền"
              value={summary?.unmatchedEvents ?? 0}
              prefix={
                <ExclamationCircleOutlined
                  style={{
                    color:
                      (summary?.unmatchedEvents ?? 0) > 0
                        ? '#ea580c'
                        : '#64748b',
                  }}
                />
              }
            />
            <div className="mt-1 text-xs text-slate-500">
              Sai số tiền, quá hạn, trùng lặp hoặc không rõ mã
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card size="small" loading={summaryQuery.isLoading}>
            <Statistic
              title="Đối soát gần nhất"
              value={
                summary?.lastRunAt
                  ? appDayJs.formatVN(summary.lastRunAt, 'DD/MM HH:mm')
                  : 'Chưa chạy'
              }
              valueStyle={{ fontSize: 20 }}
              prefix={<CreditCardOutlined style={{ color: '#2563eb' }} />}
            />
            <div className="mt-1 text-xs text-slate-500">
              Lần gần nhất: {summary?.lastFetchedCount ?? 0} GD • khớp{' '}
              {summary?.lastMatchedCount ?? 0} • chưa khớp{' '}
              {summary?.lastUnmatchedCount ?? 0}
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs
          activeKey={params.tab}
          onChange={(key) =>
            updateSearch({
              tab: key as SaasPaymentsTab,
              page: 1,
            })
          }
          items={[
            {
              key: 'orders',
              label: `Đơn thanh toán (${summary ? summary.paidOrders + summary.pendingOrders : '—'})`,
              children: (
                <div>
                  <Row
                    gutter={[8, 8]}
                    align="middle"
                    justify="space-between"
                    style={{ marginBottom: 12 }}
                  >
                    <Col xs={24} lg={14}>
                      <Segmented<OrderStatusFilter>
                        value={currentOrderStatus}
                        onChange={(value) =>
                          updateSearch({
                            orderStatus: value === 'ALL' ? undefined : value,
                            page: 1,
                          })
                        }
                        options={[
                          { label: 'Tất cả', value: 'ALL' },
                          { label: 'Chờ thanh toán', value: 'PENDING' },
                          { label: 'Đã thanh toán', value: 'PAID' },
                          { label: 'Hết hạn', value: 'EXPIRED' },
                          { label: 'Đã hủy', value: 'CANCELED' },
                        ]}
                      />
                    </Col>
                    <Col xs={24} lg={10}>
                      <Input.Search
                        placeholder="Tìm theo mã thanh toán hoặc tên Tenant..."
                        aria-label="Tìm kiếm đơn thanh toán"
                        allowClear
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}
                        onSearch={(value) =>
                          updateSearch({
                            search: value.trim() || undefined,
                            page: 1,
                          })
                        }
                      />
                    </Col>
                  </Row>

                  {ordersQuery.isError ? (
                    <Result
                      status="error"
                      title="Không tải được danh sách đơn thanh toán"
                      subTitle={ordersQuery.error.message}
                      extra={
                        <Button onClick={() => void ordersQuery.refetch()}>
                          Thử lại
                        </Button>
                      }
                    />
                  ) : (
                    <Table<PaymentOrderDto>
                      rowKey="id"
                      columns={orderColumns}
                      dataSource={ordersQuery.data?.data ?? []}
                      loading={ordersQuery.isFetching}
                      scroll={{ x: 1480 }}
                      locale={{ emptyText: 'Chưa có đơn thanh toán nào' }}
                      pagination={{
                        current: params.page,
                        pageSize: params.limit,
                        total: getPaginationTotal(ordersQuery.data?.pagination),
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 50, 100],
                        showTotal: (total) => `Tổng ${total} đơn thanh toán`,
                        onChange: (page, limit) =>
                          updateSearch({
                            page: limit !== params.limit ? 1 : page,
                            limit,
                          }),
                      }}
                    />
                  )}
                </div>
              ),
            },
            {
              key: 'events',
              label: (
                <Space size={6}>
                  <span>Sự kiện Webhook & Cần đối soát/hoàn tiền</span>
                  {(summary?.unmatchedEvents ?? 0) > 0 && (
                    <Tag color="orange" style={{ margin: 0 }}>
                      {summary?.unmatchedEvents}
                    </Tag>
                  )}
                </Space>
              ),
              children: (
                <div>
                  <Row
                    gutter={[8, 8]}
                    align="middle"
                    justify="space-between"
                    style={{ marginBottom: 12 }}
                  >
                    <Col xs={24} lg={14}>
                      <Segmented<EventStatusFilter>
                        value={currentEventStatus}
                        onChange={(value) =>
                          updateSearch({
                            eventStatus: value === 'ALL' ? undefined : value,
                            page: 1,
                          })
                        }
                        options={[
                          { label: 'Tất cả', value: 'ALL' },
                          { label: 'Cần đối soát', value: 'UNMATCHED' },
                          { label: 'Đã xử lý', value: 'PROCESSED' },
                          { label: 'Lỗi xử lý', value: 'FAILED' },
                          { label: 'Đã nhận', value: 'RECEIVED' },
                        ]}
                      />
                    </Col>
                    <Col xs={24} lg={10}>
                      <Input.Search
                        placeholder="Tìm theo mã code, mã tham chiếu hoặc webhook ID..."
                        aria-label="Tìm kiếm sự kiện webhook"
                        allowClear
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}
                        onSearch={(value) =>
                          updateSearch({
                            search: value.trim() || undefined,
                            page: 1,
                          })
                        }
                      />
                    </Col>
                  </Row>

                  {eventsQuery.isError ? (
                    <Result
                      status="error"
                      title="Không tải được danh sách sự kiện SePay"
                      subTitle={eventsQuery.error.message}
                      extra={
                        <Button onClick={() => void eventsQuery.refetch()}>
                          Thử lại
                        </Button>
                      }
                    />
                  ) : (
                    <Table<SepayWebhookEventAdminDto>
                      rowKey="id"
                      columns={eventColumns}
                      dataSource={eventsQuery.data?.data ?? []}
                      loading={eventsQuery.isFetching}
                      scroll={{ x: 1380 }}
                      locale={{ emptyText: 'Chưa có sự kiện webhook nào' }}
                      pagination={{
                        current: params.page,
                        pageSize: params.limit,
                        total: getPaginationTotal(eventsQuery.data?.pagination),
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 50, 100],
                        showTotal: (total) => `Tổng ${total} sự kiện`,
                        onChange: (page, limit) =>
                          updateSearch({
                            page: limit !== params.limit ? 1 : page,
                            limit,
                          }),
                      }}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}
