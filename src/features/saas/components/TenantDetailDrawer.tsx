import { useEffect, useMemo, useState } from 'react'
import type { Dayjs } from 'dayjs'
import {
  CheckOutlined,
  CrownOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  ReloadOutlined,
  RestOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UnlockOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Progress,
  Result,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd'
import type { TableProps } from 'antd'
import { appDayJs } from '#/shared/utils/appDayjs'
import type {
  BillingCycle,
  PlanDto,
  SubscriptionDto,
  TenantMemberDto,
  TenantMemberRole,
  TenantType,
  TenantUsageHistoryItemDto,
} from '../api/dto/saasTypes'
import {
  useAddSaasTenantMember,
  useAssignSaasTenantSubscription,
  useRemoveSaasTenantMember,
  useResetSaasTenantUsage,
  useUpdateSaasTenant,
} from '../hooks/useSaasMutations'
import { useSaasTenantDetail, useSaasUsers } from '../queries/useSaasQueries'
import {
  BILLING_CYCLE_META,
  formatMinutesLimit,
  formatPlanPrice,
  formatSaasUserName,
  formatUsedMinutes,
  getDefaultDurationDays,
  getQuotaPercent,
  MEMBER_ROLE_META,
  SUBSCRIPTION_STATUS_META,
  TENANT_STATUS_META,
  TENANT_TYPE_META,
} from '../utils/saasFormat'

interface TenantDetailDrawerProps {
  tenantId: number | null
  plans: PlanDto[]
  onClose: () => void
}

interface AssignSubscriptionFormValues {
  planId: number
  billingCycle: BillingCycle
  durationDays?: number | null
  expiresAt?: Dayjs | null
  monthlyMinutesLimitOverride?: number | null
  note?: string
}

interface AddMemberFormValues {
  userId?: number
  identifier?: string
  role: TenantMemberRole
}

interface EditTenantInfoValues {
  name: string
  type: TenantType
  contactEmail?: string
  notes?: string
}

export default function TenantDetailDrawer({
  tenantId,
  plans,
  onClose,
}: TenantDetailDrawerProps) {
  const [subForm] = Form.useForm<AssignSubscriptionFormValues>()
  const [memberForm] = Form.useForm<AddMemberFormValues>()
  const [editInfoForm] = Form.useForm<EditTenantInfoValues>()
  const [editingInfo, setEditingInfo] = useState(false)
  const [userSearch, setUserSearch] = useState('')

  const detailQuery = useSaasTenantDetail(tenantId)
  const usersQuery = useSaasUsers(
    { page: 1, limit: 20, search: userSearch.trim() || undefined },
    tenantId !== null,
  )

  const updateTenantMutation = useUpdateSaasTenant()
  const assignSubMutation = useAssignSaasTenantSubscription()
  const addMemberMutation = useAddSaasTenantMember()
  const removeMemberMutation = useRemoveSaasTenantMember()
  const resetUsageMutation = useResetSaasTenantUsage()

  const tenant = detailQuery.data

  const activeSubscription = useMemo(() => {
    if (!tenant) return null
    if (tenant.activeSubscription) return tenant.activeSubscription
    return (
      tenant.subscriptions.find((item) => item.status === 'ACTIVE') ??
      tenant.subscriptions.at(0) ??
      null
    )
  }, [tenant])

  useEffect(() => {
    if (!tenant) return
    setEditingInfo(false)
    editInfoForm.setFieldsValue({
      name: tenant.name,
      type: tenant.type,
      contactEmail: tenant.contactEmail ?? '',
      notes: tenant.notes ?? '',
    })
    const initialPlanId = activeSubscription?.planId ?? plans.at(0)?.id
    const initialPlan =
      plans.find((item) => item.id === initialPlanId) ??
      activeSubscription?.plan
    const initialCycle: BillingCycle =
      activeSubscription?.billingCycle ?? 'MONTHLY'
    subForm.setFieldsValue({
      planId: initialPlanId,
      billingCycle: initialCycle,
      durationDays: getDefaultDurationDays(initialPlan, initialCycle),
      expiresAt: null,
      monthlyMinutesLimitOverride: null,
      note: '',
    })
    memberForm.setFieldsValue({
      userId: undefined,
      identifier: '',
      role: 'MEMBER',
    })
  }, [tenant, activeSubscription, plans, editInfoForm, subForm, memberForm])

  const handleToggleStatus = async () => {
    if (!tenant) return
    await updateTenantMutation.mutateAsync({
      id: tenant.id,
      payload: {
        status: tenant.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
      },
    })
  }

  const handleSaveInfo = async () => {
    if (!tenant) return
    const values = await editInfoForm.validateFields()
    await updateTenantMutation.mutateAsync({
      id: tenant.id,
      payload: {
        name: values.name.trim(),
        type: values.type,
        contactEmail: values.contactEmail?.trim() || null,
        notes: values.notes?.trim() || null,
      },
    })
    setEditingInfo(false)
  }

  const handleAssignSubscription = async () => {
    if (!tenant) return
    const values = await subForm.validateFields()
    await assignSubMutation.mutateAsync({
      tenantId: tenant.id,
      payload: {
        planId: values.planId,
        billingCycle: values.billingCycle,
        durationDays:
          values.billingCycle === 'LIFETIME'
            ? null
            : values.durationDays ?? undefined,
        expiresAt: values.expiresAt
          ? appDayJs.toUTCISOString(values.expiresAt)
          : undefined,
        monthlyMinutesLimitOverride:
          values.monthlyMinutesLimitOverride !== undefined &&
          values.monthlyMinutesLimitOverride !== null
            ? Number(values.monthlyMinutesLimitOverride)
            : null,
        note: values.note?.trim() || null,
      },
    })
    subForm.setFieldsValue({ note: '', expiresAt: null })
  }

  const handleAddMember = async () => {
    if (!tenant) return
    const values = await memberForm.validateFields()
    const identifier = values.identifier?.trim() || undefined
    if (!values.userId && !identifier) {
      return
    }
    await addMemberMutation.mutateAsync({
      tenantId: tenant.id,
      payload: {
        userId: values.userId,
        identifier,
        role: values.role,
      },
    })
    memberForm.resetFields(['userId', 'identifier'])
  }

  const handleChangeMemberRole = async (
    userId: number,
    role: TenantMemberRole,
  ) => {
    if (!tenant) return
    await addMemberMutation.mutateAsync({
      tenantId: tenant.id,
      payload: { userId, role },
    })
  }

  const currentLimitMinutes =
    tenant?.quota?.limitMinutes ??
    activeSubscription?.monthlyMinutesLimitOverride ??
    activeSubscription?.plan.monthlyMinutesLimit ??
    null

  const currentPeriod =
    tenant?.quota?.period ??
    tenant?.usageHistory.at(0)?.period ??
    appDayJs.fromUTC(new Date()).format('YYYY-MM')

  const currentUsageRow = tenant?.usageHistory.find(
    (item) => item.period === currentPeriod,
  )
  const currentUsedMinutes = tenant?.quota
    ? formatUsedMinutes(tenant.quota.usedMinutes, tenant.quota.usedSeconds)
    : formatUsedMinutes(
        currentUsageRow?.usedMinutes,
        currentUsageRow?.usedSeconds,
      )
  const currentQuotaPercent = getQuotaPercent(
    currentUsedMinutes,
    currentLimitMinutes,
  )

  const subscriptionColumns: TableProps<SubscriptionDto>['columns'] = [
    {
      title: 'Gói',
      key: 'plan',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{record.plan.name}</Typography.Text>
          {record.plan.code && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {record.plan.code}
            </Typography.Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      render: (status: SubscriptionDto['status']) => {
        const meta = SUBSCRIPTION_STATUS_META[status]
        return <Tag color={meta.color}>{meta.label}</Tag>
      },
    },
    {
      title: 'Chu kỳ',
      dataIndex: 'billingCycle',
      width: 115,
      render: (cycle: BillingCycle) => {
        const meta = BILLING_CYCLE_META[cycle]
        return <Tag color={meta.color}>{meta.label}</Tag>
      },
    },
    {
      title: 'Hạn mức',
      key: 'limit',
      width: 140,
      render: (_, record) => {
        const effective =
          record.monthlyMinutesLimitOverride ?? record.plan.monthlyMinutesLimit
        return (
          <Space direction="vertical" size={0}>
            <span>{formatMinutesLimit(effective)}</span>
            {record.monthlyMinutesLimitOverride !== null && (
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                (Ghi đè riêng)
              </Typography.Text>
            )}
          </Space>
        )
      },
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'startsAt',
      width: 145,
      render: (value: string) => appDayJs.formatVN(value, 'DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Hết hạn',
      dataIndex: 'expiresAt',
      width: 145,
      render: (value: string | null) =>
        value ? appDayJs.formatVN(value, 'DD/MM/YYYY HH:mm') : 'Không hết hạn',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      ellipsis: true,
      render: (note: string | null) => note || '—',
    },
  ]

  const memberColumns: TableProps<TenantMemberDto>['columns'] = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>
            {formatSaasUserName(record.user)}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {record.user?.email || record.user?.username || `ID #${record.userId}`}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      width: 170,
      render: (role: TenantMemberRole, record) => (
        <Select<TenantMemberRole>
          size="small"
          value={role}
          style={{ width: 145 }}
          disabled={addMemberMutation.isPending}
          onChange={(nextRole) =>
            void handleChangeMemberRole(record.userId, nextRole)
          }
          options={[
            { value: 'OWNER', label: MEMBER_ROLE_META.OWNER.label },
            { value: 'ADMIN', label: MEMBER_ROLE_META.ADMIN.label },
            { value: 'MEMBER', label: MEMBER_ROLE_META.MEMBER.label },
          ]}
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      align: 'right',
      render: (_, record) => (
        <Popconfirm
          title="Xóa thành viên khỏi Tenant?"
          description={`Người dùng ${formatSaasUserName(record.user)} sẽ mất quyền truy cập gói của Tenant này.`}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
          onConfirm={() =>
            tenant
              ? removeMemberMutation.mutateAsync({
                  tenantId: tenant.id,
                  userId: record.userId,
                })
              : undefined
          }
        >
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            loading={
              removeMemberMutation.isPending &&
              removeMemberMutation.variables.userId === record.userId
            }
          />
        </Popconfirm>
      ),
    },
  ]

  const usageColumns: TableProps<TenantUsageHistoryItemDto>['columns'] = [
    {
      title: 'Kỳ (Tháng)',
      dataIndex: 'period',
      width: 120,
      render: (period: string) => <Tag color="blue">{period}</Tag>,
    },
    {
      title: 'Đã dùng',
      key: 'used',
      render: (_, record) => {
        const mins = formatUsedMinutes(record.usedMinutes, record.usedSeconds)
        return (
          <Space direction="vertical" size={0}>
            <Typography.Text strong>{mins} phút</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {new Intl.NumberFormat('vi-VN').format(record.usedSeconds)} giây
            </Typography.Text>
          </Space>
        )
      },
    },
    {
      title: 'Số câu lồng tiếng',
      dataIndex: 'dubbedCues',
      width: 140,
      render: (val?: number) =>
        typeof val === 'number'
          ? new Intl.NumberFormat('vi-VN').format(val)
          : '—',
    },
    {
      title: 'Số phiên',
      dataIndex: 'sessionsCount',
      width: 100,
      render: (val?: number) =>
        typeof val === 'number'
          ? new Intl.NumberFormat('vi-VN').format(val)
          : '—',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <Popconfirm
          title={`Đặt lại hạn mức kỳ ${record.period}?`}
          description="Số giây đã sử dụng trong kỳ này sẽ được đặt về 0."
          okText="Đặt lại"
          cancelText="Hủy"
          onConfirm={() =>
            tenant
              ? resetUsageMutation.mutateAsync({
                  tenantId: tenant.id,
                  payload: { period: record.period },
                })
              : undefined
          }
        >
          <Button
            size="small"
            icon={<RestOutlined />}
            loading={
              resetUsageMutation.isPending &&
              resetUsageMutation.variables.payload?.period === record.period
            }
          >
            Reset
          </Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <Drawer
      title={
        tenant ? (
          <Space wrap>
            <span>Chi tiết Tenant: {tenant.name}</span>
            <Tag color={TENANT_TYPE_META[tenant.type].color}>
              {TENANT_TYPE_META[tenant.type].label}
            </Tag>
            <Tag color={TENANT_STATUS_META[tenant.status].color}>
              {TENANT_STATUS_META[tenant.status].label}
            </Tag>
          </Space>
        ) : (
          'Chi tiết Tenant'
        )
      }
      open={tenantId !== null}
      width={880}
      onClose={onClose}
      extra={
        tenant && (
          <Space>
            <Button
              icon={<ReloadOutlined />}
              loading={detailQuery.isFetching}
              onClick={() => void detailQuery.refetch()}
            />
            <Popconfirm
              title={
                tenant.status === 'ACTIVE'
                  ? 'Tạm khóa Tenant này?'
                  : 'Mở khóa Tenant này?'
              }
              description={
                tenant.status === 'ACTIVE'
                  ? 'Người dùng thuộc Tenant sẽ bị chặn lồng tiếng cho đến khi được mở khóa.'
                  : 'Tenant sẽ được kích hoạt hoạt động trở lại.'
              }
              okText={tenant.status === 'ACTIVE' ? 'Tạm khóa' : 'Mở khóa'}
              cancelText="Hủy"
              okButtonProps={{ danger: tenant.status === 'ACTIVE' }}
              onConfirm={() => void handleToggleStatus()}
            >
              <Button
                danger={tenant.status === 'ACTIVE'}
                icon={
                  tenant.status === 'ACTIVE' ? (
                    <LockOutlined />
                  ) : (
                    <UnlockOutlined />
                  )
                }
                loading={updateTenantMutation.isPending}
              >
                {tenant.status === 'ACTIVE' ? 'Tạm khóa' : 'Mở khóa'}
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    >
      {detailQuery.isLoading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : detailQuery.isError ? (
        <Result
          status="error"
          title="Không tải được chi tiết Tenant"
          subTitle={detailQuery.error.message}
          extra={
            <Button onClick={() => void detailQuery.refetch()}>Thử lại</Button>
          }
        />
      ) : tenant ? (
        <div className="flex flex-col gap-4">
          <Card
            size="small"
            title="Thông tin cơ bản"
            extra={
              editingInfo ? (
                <Space>
                  <Button
                    size="small"
                    onClick={() => setEditingInfo(false)}
                    disabled={updateTenantMutation.isPending}
                  >
                    Hủy
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    icon={<CheckOutlined />}
                    loading={updateTenantMutation.isPending}
                    onClick={() => void handleSaveInfo()}
                  >
                    Lưu
                  </Button>
                </Space>
              ) : (
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => setEditingInfo(true)}
                >
                  Chỉnh sửa
                </Button>
              )
            }
          >
            {editingInfo ? (
              <Form<EditTenantInfoValues> form={editInfoForm} layout="vertical">
                <Row gutter={12}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Tên Tenant"
                      name="name"
                      rules={[
                        { required: true, message: 'Vui lòng nhập tên Tenant' },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Form.Item label="Loại" name="type">
                      <Select
                        options={[
                          { value: 'PERSONAL', label: 'Cá nhân' },
                          { value: 'ORGANIZATION', label: 'Tổ chức' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Form.Item label="Email liên hệ" name="contactEmail">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Ghi chú" name="notes" style={{ marginBottom: 0 }}>
                  <Input.TextArea rows={2} />
                </Form.Item>
              </Form>
            ) : (
              <Descriptions size="small" column={{ xs: 1, sm: 2 }}>
                <Descriptions.Item label="Mã Tenant">
                  <Typography.Text code>{tenant.code}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Email liên hệ">
                  {tenant.contactEmail || '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {appDayJs.formatVN(tenant.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Thành viên">
                  {tenant.members.length} thành viên
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú" span={2}>
                  {tenant.notes || '—'}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>

          <Tabs
            defaultActiveKey="subscription"
            items={[
              {
                key: 'subscription',
                label: (
                  <span>
                    <CrownOutlined /> Gói & Gia hạn
                  </span>
                ),
                children: (
                  <div className="flex flex-col gap-4">
                    <Card size="small" title="Gói dịch vụ hiện tại">
                      {activeSubscription ? (
                        <Descriptions size="small" column={{ xs: 1, sm: 2 }}>
                          <Descriptions.Item label="Tên gói">
                            <Typography.Text strong>
                              {activeSubscription.plan.name}
                            </Typography.Text>
                          </Descriptions.Item>
                          <Descriptions.Item label="Trạng thái">
                            <Tag
                              color={
                                SUBSCRIPTION_STATUS_META[
                                  activeSubscription.status
                                ].color
                              }
                            >
                              {
                                SUBSCRIPTION_STATUS_META[
                                  activeSubscription.status
                                ].label
                              }
                            </Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label="Chu kỳ">
                            {
                              BILLING_CYCLE_META[
                                activeSubscription.billingCycle
                              ].label
                            }
                          </Descriptions.Item>
                          <Descriptions.Item label="Hạn mức tháng">
                            {formatMinutesLimit(currentLimitMinutes)}
                          </Descriptions.Item>
                          <Descriptions.Item label="Ngày bắt đầu">
                            {appDayJs.formatVN(activeSubscription.startsAt)}
                          </Descriptions.Item>
                          <Descriptions.Item label="Ngày hết hạn">
                            {activeSubscription.expiresAt
                              ? appDayJs.formatVN(activeSubscription.expiresAt)
                              : 'Không hết hạn'}
                          </Descriptions.Item>
                        </Descriptions>
                      ) : (
                        <Typography.Text type="secondary">
                          Tenant chưa có gói dịch vụ nào đang hoạt động.
                        </Typography.Text>
                      )}
                    </Card>

                    <Card size="small" title="Gán / Nâng cấp / Gia hạn gói">
                      <Form<AssignSubscriptionFormValues>
                        form={subForm}
                        layout="vertical"
                      >
                        <Row gutter={12}>
                          <Col xs={24} sm={14}>
                            <Form.Item
                              label="Chọn gói dịch vụ"
                              name="planId"
                              rules={[
                                { required: true, message: 'Vui lòng chọn gói' },
                              ]}
                            >
                              <Select
                                onChange={(planId: number) => {
                                  const selectedPlan = plans.find(
                                    (item) => item.id === planId,
                                  )
                                  const cycle = subForm.getFieldValue(
                                    'billingCycle',
                                  ) as BillingCycle | undefined
                                  const nextDuration = getDefaultDurationDays(
                                    selectedPlan,
                                    cycle ?? 'MONTHLY',
                                  )
                                  subForm.setFieldsValue({
                                    durationDays: nextDuration,
                                    ...(nextDuration === null
                                      ? { expiresAt: null }
                                      : {}),
                                  })
                                }}
                                options={plans.map((plan) => ({
                                  value: plan.id,
                                  label: `${plan.name} — ${formatPlanPrice(plan.priceMonthly, plan.currency)}/tháng (${formatMinutesLimit(plan.monthlyMinutesLimit)})`,
                                }))}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={10}>
                            <Form.Item label="Chu kỳ thanh toán" name="billingCycle">
                              <Select
                                onChange={(cycle: BillingCycle) => {
                                  const planId = subForm.getFieldValue(
                                    'planId',
                                  ) as number | undefined
                                  const selectedPlan = plans.find(
                                    (item) => item.id === planId,
                                  )
                                  const nextDuration = getDefaultDurationDays(
                                    selectedPlan,
                                    cycle,
                                  )
                                  subForm.setFieldsValue({
                                    durationDays: nextDuration,
                                    ...(nextDuration === null
                                      ? { expiresAt: null }
                                      : {}),
                                  })
                                }}
                                options={[
                                  { value: 'MONTHLY', label: 'Theo tháng' },
                                  { value: 'YEARLY', label: 'Theo năm' },
                                  { value: 'LIFETIME', label: 'Trọn đời' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={12}>
                          <Col xs={24} sm={8}>
                            <Form.Item
                              label="Thời hạn (ngày)"
                              name="durationDays"
                            >
                              <InputNumber<number>
                                min={1}
                                style={{ width: '100%' }}
                                placeholder="30 / 365"
                                suffix="ngày"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={8}>
                            <Form.Item
                              label="Hoặc ngày hết hạn"
                              name="expiresAt"
                            >
                              <DatePicker
                                showTime
                                format="DD/MM/YYYY HH:mm"
                                style={{ width: '100%' }}
                                placeholder="Chọn ngày hết hạn"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={8}>
                            <Form.Item
                              label="Ghi đè hạn mức (phút)"
                              name="monthlyMinutesLimitOverride"
                              tooltip="Để trống để dùng hạn mức mặc định của gói"
                            >
                              <InputNumber<number>
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="Mặc định theo gói"
                                suffix="phút"
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item label="Ghi chú kích hoạt" name="note">
                          <Input placeholder="vd: Đã nhận chuyển khoản gia hạn 1 năm" />
                        </Form.Item>

                        <Button
                          type="primary"
                          icon={<CrownOutlined />}
                          loading={assignSubMutation.isPending}
                          onClick={() => void handleAssignSubscription()}
                        >
                          Áp dụng gói mới (thay thế gói đang chạy)
                        </Button>
                      </Form>
                    </Card>

                    <div>
                      <Typography.Title level={5} style={{ marginTop: 0 }}>
                        Lịch sử Subscription
                      </Typography.Title>
                      <Table<SubscriptionDto>
                        size="small"
                        rowKey="id"
                        columns={subscriptionColumns}
                        dataSource={tenant.subscriptions}
                        pagination={false}
                        scroll={{ x: 760 }}
                        locale={{ emptyText: 'Chưa có lịch sử gói dịch vụ' }}
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: 'members',
                label: (
                  <span>
                    <TeamOutlined /> Thành viên ({tenant.members.length})
                  </span>
                ),
                children: (
                  <div className="flex flex-col gap-4">
                    <Card size="small" title="Thêm thành viên vào Tenant">
                      <Form<AddMemberFormValues>
                        form={memberForm}
                        layout="vertical"
                      >
                        <Row gutter={12}>
                          <Col xs={24} sm={10}>
                            <Form.Item
                              label="Chọn người dùng có sẵn"
                              name="userId"
                            >
                              <Select
                                showSearch
                                allowClear
                                filterOption={false}
                                placeholder="Tìm theo tên, email, username..."
                                loading={usersQuery.isFetching}
                                onSearch={setUserSearch}
                                options={(usersQuery.data ?? []).map((user) => ({
                                  value: user.id,
                                  label: `${formatSaasUserName(user)} (${user.email || user.username})`,
                                }))}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={8}>
                            <Form.Item
                              label="Hoặc nhập Email / Username"
                              name="identifier"
                            >
                              <Input placeholder="user@example.com" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={6}>
                            <Form.Item label="Vai trò" name="role">
                              <Select
                                options={[
                                  { value: 'MEMBER', label: 'Thành viên' },
                                  { value: 'ADMIN', label: 'Quản trị' },
                                  { value: 'OWNER', label: 'Chủ sở hữu' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Button
                          type="primary"
                          icon={<UserAddOutlined />}
                          loading={addMemberMutation.isPending}
                          onClick={() => void handleAddMember()}
                        >
                          Thêm thành viên
                        </Button>
                      </Form>
                    </Card>

                    <Table<TenantMemberDto>
                      size="small"
                      rowKey={(record) => `${record.tenantId}-${record.userId}`}
                      columns={memberColumns}
                      dataSource={tenant.members}
                      pagination={false}
                      locale={{ emptyText: 'Chưa có thành viên nào' }}
                    />
                  </div>
                ),
              },
              {
                key: 'usage',
                label: (
                  <span>
                    <ThunderboltOutlined /> Hạn mức sử dụng
                  </span>
                ),
                children: (
                  <div className="flex flex-col gap-4">
                    <Card
                      size="small"
                      title={`Mức sử dụng kỳ hiện tại (${currentPeriod})`}
                      extra={
                        <Popconfirm
                          title={`Đặt lại hạn mức kỳ ${currentPeriod}?`}
                          description="Thao tác này sẽ đưa số phút đã sử dụng trong tháng hiện tại về 0."
                          okText="Xác nhận reset"
                          cancelText="Hủy"
                          onConfirm={() =>
                            resetUsageMutation.mutateAsync({
                              tenantId: tenant.id,
                              payload: { period: currentPeriod },
                            })
                          }
                        >
                          <Button
                            danger
                            size="small"
                            icon={<RestOutlined />}
                            loading={resetUsageMutation.isPending}
                          >
                            Reset quota tháng này
                          </Button>
                        </Popconfirm>
                      }
                    >
                      <Row gutter={[16, 12]} align="middle">
                        <Col xs={24} sm={14}>
                          <Progress
                            percent={
                              currentLimitMinutes === null
                                ? 0
                                : currentQuotaPercent
                            }
                            status={
                              currentLimitMinutes !== null &&
                              currentQuotaPercent >= 100
                                ? 'exception'
                                : 'active'
                            }
                          />
                        </Col>
                        <Col xs={24} sm={10}>
                          <Typography.Text strong>
                            {currentUsedMinutes} phút
                          </Typography.Text>{' '}
                          <Typography.Text type="secondary">
                            / {formatMinutesLimit(currentLimitMinutes)}
                          </Typography.Text>
                        </Col>
                      </Row>
                    </Card>

                    <Divider style={{ margin: '4px 0' }} />

                    <Table<TenantUsageHistoryItemDto>
                      size="small"
                      rowKey="period"
                      columns={usageColumns}
                      dataSource={tenant.usageHistory}
                      pagination={false}
                      locale={{ emptyText: 'Chưa có dữ liệu sử dụng' }}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      ) : null}
    </Drawer>
  )
}
