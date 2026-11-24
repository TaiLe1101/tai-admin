import { useEffect, useState } from 'react'
import type { Dayjs } from 'dayjs'
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from 'antd'
import { appDayJs } from '#/shared/utils/appDayjs'
import type {
  BillingCycle,
  CreateTenantReq,
  PlanDto,
  TenantType,
} from '../api/dto/saasTypes'
import { useCreateSaasTenant } from '../hooks/useSaasMutations'
import { useSaasUsers } from '../queries/useSaasQueries'
import {
  formatMinutesLimit,
  formatPlanPrice,
  formatSaasUserName,
  getDefaultDurationDays,
} from '../utils/saasFormat'

interface CreateTenantFormValues {
  name: string
  code?: string
  type: TenantType
  contactEmail?: string
  notes?: string
  ownerUserId?: number
  initialPlanId?: number
  billingCycle: BillingCycle
  durationDays?: number | null
  expiresAt?: Dayjs | null
}

interface CreateTenantModalProps {
  open: boolean
  plans: PlanDto[]
  onClose: () => void
  onCreated?: (tenantId: number) => void
}

export default function CreateTenantModal({
  open,
  plans,
  onClose,
  onCreated,
}: CreateTenantModalProps) {
  const [form] = Form.useForm<CreateTenantFormValues>()
  const [userSearch, setUserSearch] = useState('')
  const createMutation = useCreateSaasTenant()
  const usersQuery = useSaasUsers(
    { page: 1, limit: 20, search: userSearch.trim() || undefined },
    open,
  )

  useEffect(() => {
    if (!open) return
    const defaultPlan = plans.find((item) => item.isDefault) ?? plans.at(0)
    form.setFieldsValue({
      name: '',
      code: '',
      type: 'ORGANIZATION',
      contactEmail: '',
      notes: '',
      ownerUserId: undefined,
      initialPlanId: defaultPlan?.id,
      billingCycle: 'MONTHLY',
      durationDays: getDefaultDurationDays(defaultPlan, 'MONTHLY'),
      expiresAt: null,
    })
    setUserSearch('')
  }, [open, plans, form])

  const handlePlanChange = (planId?: number) => {
    const selectedPlan = plans.find((item) => item.id === planId)
    const cycle = form.getFieldValue('billingCycle') as
      | BillingCycle
      | undefined
    const nextDuration = getDefaultDurationDays(
      selectedPlan,
      cycle ?? 'MONTHLY',
    )
    form.setFieldsValue({
      durationDays: nextDuration,
      ...(nextDuration === null ? { expiresAt: null } : {}),
    })
  }

  const handleBillingCycleChange = (cycle: BillingCycle) => {
    const planId = form.getFieldValue('initialPlanId') as number | undefined
    const selectedPlan = plans.find((item) => item.id === planId)
    const nextDuration = getDefaultDurationDays(selectedPlan, cycle)
    form.setFieldsValue({
      durationDays: nextDuration,
      ...(nextDuration === null ? { expiresAt: null } : {}),
    })
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    const payload: CreateTenantReq = {
      name: values.name.trim(),
      code: values.code?.trim() || undefined,
      type: values.type,
      contactEmail: values.contactEmail?.trim() || null,
      notes: values.notes?.trim() || null,
      ownerUserId: values.ownerUserId,
      initialPlanId: values.initialPlanId,
      billingCycle: values.billingCycle,
      durationDays:
        values.billingCycle === 'LIFETIME'
          ? null
          : values.durationDays ?? undefined,
      expiresAt: values.expiresAt
        ? appDayJs.toUTCISOString(values.expiresAt)
        : undefined,
    }
    const res = await createMutation.mutateAsync(payload)
    onClose()
    if (res.data.id) {
      onCreated?.(res.data.id)
    }
  }

  return (
    <Modal
      title="Tạo Tenant mới"
      open={open}
      width={640}
      okText="Tạo Tenant"
      cancelText="Hủy"
      confirmLoading={createMutation.isPending}
      onOk={() => void handleOk()}
      onCancel={onClose}
    >
      <Form<CreateTenantFormValues> form={form} layout="vertical">
        <Row gutter={12}>
          <Col xs={24} sm={14}>
            <Form.Item
              label="Tên Tenant"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên Tenant' }]}
            >
              <Input placeholder="vd: Công ty ABC / Không gian nhóm Marketing" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={10}>
            <Form.Item label="Mã Tenant (tùy chọn)" name="code">
              <Input placeholder="Tự động tạo nếu để trống" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} sm={10}>
            <Form.Item label="Loại Tenant" name="type">
              <Select
                options={[
                  { value: 'ORGANIZATION', label: 'Tổ chức (Organization)' },
                  { value: 'PERSONAL', label: 'Cá nhân (Personal)' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={14}>
            <Form.Item
              label="Email liên hệ"
              name="contactEmail"
              rules={[
                { type: 'email', message: 'Địa chỉ email không hợp lệ' },
              ]}
            >
              <Input placeholder="contact@company.com" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Chủ sở hữu ban đầu (Owner - tùy chọn)" name="ownerUserId">
          <Select
            showSearch
            allowClear
            filterOption={false}
            placeholder="Tìm theo tên, username hoặc email..."
            loading={usersQuery.isFetching}
            onSearch={setUserSearch}
            options={(usersQuery.data ?? []).map((user) => ({
              value: user.id,
              label: `${formatSaasUserName(user)} (${user.email || user.username})`,
            }))}
          />
        </Form.Item>

        <Row gutter={12}>
          <Col xs={24} sm={14}>
            <Form.Item label="Gói dịch vụ ban đầu" name="initialPlanId">
              <Select
                allowClear
                placeholder="Chọn gói kích hoạt"
                onChange={handlePlanChange}
                options={plans.map((plan) => ({
                  value: plan.id,
                  label: `${plan.name} — ${formatPlanPrice(plan.priceMonthly, plan.currency)}/tháng (${formatMinutesLimit(plan.monthlyMinutesLimit)})`,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={10}>
            <Form.Item label="Chu kỳ" name="billingCycle">
              <Select
                onChange={handleBillingCycleChange}
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
          <Col xs={24} sm={12}>
            <Form.Item
              label="Thời hạn (số ngày)"
              name="durationDays"
              tooltip="Để trống nếu chọn ngày hết hạn cụ thể hoặc gói trọn đời"
            >
              <InputNumber<number>
                min={1}
                style={{ width: '100%' }}
                placeholder="vd: 30 hoặc 365"
                suffix="ngày"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Hoặc ngày hết hạn cụ thể"
              name="expiresAt"
              tooltip="Nếu chọn ngày hết hạn cụ thể, hệ thống sẽ ưu tiên ngày này"
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
                placeholder="Chọn ngày hết hạn"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Ghi chú nội bộ" name="notes">
          <Input.TextArea rows={2} placeholder="Ghi chú hợp đồng, liên hệ..." />
        </Form.Item>
      </Form>
    </Modal>
  )
}
