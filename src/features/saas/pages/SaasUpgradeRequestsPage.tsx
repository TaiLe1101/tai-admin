import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Result,
  Row,
  Segmented,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { TableProps } from 'antd'
import { appDayJs } from '#/shared/utils/appDayjs'
import {
  getPaginationTotal,
  getPaginationTotalPages,
} from '../api/dto/saasTypes'
import type {
  UpgradeRequestDto,
  UpgradeRequestListQuery,
  UpgradeRequestStatus,
} from '../api/dto/saasTypes'
import UpgradeRequestActionModal from '../components/UpgradeRequestActionModal'
import { useSaasUpgradeRequests } from '../queries/useSaasQueries'
import {
  BILLING_CYCLE_META,
  formatPlanPrice,
  formatSaasUserName,
  UPGRADE_REQUEST_STATUS_META,
} from '../utils/saasFormat'

const routeApi = getRouteApi('/_main-layout/saas/upgrade-requests/')

type StatusFilterValue = 'ALL' | UpgradeRequestStatus

export default function SaasUpgradeRequestsPage() {
  const params = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const [selectedRequest, setSelectedRequest] =
    useState<UpgradeRequestDto | null>(null)
  const [actionMode, setActionMode] = useState<'approve' | 'reject' | null>(
    null,
  )

  const requestsQuery = useSaasUpgradeRequests(params)

  const updateSearch = (changes: Partial<UpgradeRequestListQuery>) => {
    void navigate({ search: (prev) => ({ ...prev, ...changes }) })
  }

  useEffect(() => {
    if (!requestsQuery.data || requestsQuery.isFetching) return
    const lastPage = getPaginationTotalPages(requestsQuery.data.pagination)
    if (params.page > lastPage) {
      void navigate({
        search: (prev) => ({ ...prev, page: lastPage }),
        replace: true,
      })
    }
  }, [requestsQuery.data, requestsQuery.isFetching, params.page, navigate])

  const openAction = (
    record: UpgradeRequestDto,
    mode: 'approve' | 'reject',
  ) => {
    setSelectedRequest(record)
    setActionMode(mode)
  }

  const closeAction = () => {
    setSelectedRequest(null)
    setActionMode(null)
  }

  const columns: TableProps<UpgradeRequestDto>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 70,
      render: (id: number) => `#${id}`,
    },
    {
      title: 'Tenant & Người gửi',
      key: 'tenant',
      width: 240,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>
            {record.tenant?.name ?? `Tenant #${record.tenantId}`}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {formatSaasUserName(record.user)}
            {record.user?.email ? ` (${record.user.email})` : ''}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Gói yêu cầu',
      key: 'plan',
      width: 210,
      render: (_, record) => {
        const price =
          record.requestedPlan &&
          (record.billingCycle === 'YEARLY'
            ? record.requestedPlan.priceYearly
            : record.requestedPlan.priceMonthly)
        return (
          <Space direction="vertical" size={2}>
            <Space size={6} wrap>
              <Typography.Text strong>
                {record.requestedPlan?.name ??
                  `Plan #${record.requestedPlanId}`}
              </Typography.Text>
              <Tag color={BILLING_CYCLE_META[record.billingCycle].color}>
                {BILLING_CYCLE_META[record.billingCycle].label}
              </Tag>
            </Space>
            {typeof price === 'number' && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {formatPlanPrice(price, record.requestedPlan?.currency)}
              </Typography.Text>
            )}
          </Space>
        )
      },
    },
    {
      title: 'Ghi chú khách hàng',
      dataIndex: 'contactNote',
      width: 240,
      render: (note: string | null) =>
        note ? (
          <Typography.Paragraph
            ellipsis={{ rows: 2, tooltip: note }}
            style={{ marginBottom: 0 }}
          >
            {note}
          </Typography.Paragraph>
        ) : (
          <Typography.Text type="secondary">—</Typography.Text>
        ),
    },
    {
      title: 'Trạng thái & Ghi chú Admin',
      key: 'status',
      width: 210,
      render: (_, record) => {
        const meta = UPGRADE_REQUEST_STATUS_META[record.status]
        return (
          <Space direction="vertical" size={2}>
            <Tag color={meta.color}>{meta.label}</Tag>
            {record.adminNote && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {record.adminNote}
              </Typography.Text>
            )}
            {record.resolvedAt && (
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                Xử lý: {appDayJs.formatVN(record.resolvedAt, 'DD/MM/YYYY HH:mm')}
              </Typography.Text>
            )}
          </Space>
        )
      },
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      width: 150,
      render: (value: string) => appDayJs.formatVN(value, 'DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 190,
      fixed: 'right',
      render: (_, record) =>
        record.status === 'PENDING' ? (
          <Space size={8}>
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => openAction(record, 'approve')}
            >
              Duyệt
            </Button>
            <Button
              danger
              size="small"
              icon={<CloseOutlined />}
              onClick={() => openAction(record, 'reject')}
            >
              Từ chối
            </Button>
          </Space>
        ) : (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Đã xử lý
          </Typography.Text>
        ),
    },
  ]

  const currentStatusFilter: StatusFilterValue = params.status ?? 'ALL'

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
            Yêu cầu nâng cấp gói
          </Typography.Title>
        </Col>
        <Col>
          <Button
            icon={<ReloadOutlined />}
            loading={requestsQuery.isFetching}
            onClick={() => void requestsQuery.refetch()}
          >
            Tải lại
          </Button>
        </Col>
      </Row>

      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Segmented<StatusFilterValue>
            value={currentStatusFilter}
            onChange={(value) =>
              updateSearch({
                status: value === 'ALL' ? undefined : value,
                page: 1,
              })
            }
            options={[
              { label: 'Tất cả', value: 'ALL' },
              { label: 'Chờ duyệt', value: 'PENDING' },
              { label: 'Đã duyệt', value: 'APPROVED' },
              { label: 'Từ chối', value: 'REJECTED' },
            ]}
          />
        </div>

        {requestsQuery.isError ? (
          <Result
            status="error"
            title="Không tải được danh sách yêu cầu nâng cấp"
            subTitle={requestsQuery.error.message}
            extra={
              <Button onClick={() => void requestsQuery.refetch()}>
                Thử lại
              </Button>
            }
          />
        ) : (
          <Table<UpgradeRequestDto>
            rowKey="id"
            columns={columns}
            dataSource={requestsQuery.data?.data ?? []}
            loading={requestsQuery.isFetching}
            scroll={{ x: 1260 }}
            locale={{ emptyText: 'Không có yêu cầu nâng cấp nào' }}
            pagination={{
              current: params.page,
              pageSize: params.limit,
              total: getPaginationTotal(requestsQuery.data?.pagination),
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50, 100],
              showTotal: (total) => `Tổng ${total} yêu cầu`,
              onChange: (page, limit) =>
                updateSearch({
                  page: limit !== params.limit ? 1 : page,
                  limit,
                }),
            }}
          />
        )}
      </Card>

      <UpgradeRequestActionModal
        request={selectedRequest}
        mode={actionMode}
        onClose={closeAction}
      />
    </div>
  )
}
