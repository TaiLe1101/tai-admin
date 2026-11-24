import { useEffect } from 'react'
import type { Dayjs } from 'dayjs'
import {
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Tag,
} from 'antd'
import { appDayJs } from '#/shared/utils/appDayjs'
import type { UpgradeRequestDto } from '../api/dto/saasTypes'
import {
  useApproveSaasUpgradeRequest,
  useRejectSaasUpgradeRequest,
} from '../hooks/useSaasMutations'
import {
  BILLING_CYCLE_META,
  formatPlanPrice,
  formatSaasUserName,
} from '../utils/saasFormat'

interface UpgradeRequestActionModalProps {
  request: UpgradeRequestDto | null
  mode: 'approve' | 'reject' | null
  onClose: () => void
}

interface ActionFormValues {
  durationDays?: number | null
  expiresAt?: Dayjs | null
  monthlyMinutesLimitOverride?: number | null
  adminNote?: string
}

export default function UpgradeRequestActionModal({
  request,
  mode,
  onClose,
}: UpgradeRequestActionModalProps) {
  const [form] = Form.useForm<ActionFormValues>()
  const approveMutation = useApproveSaasUpgradeRequest()
  const rejectMutation = useRejectSaasUpgradeRequest()
  const isSubmitting = approveMutation.isPending || rejectMutation.isPending

  useEffect(() => {
    if (!request || !mode) return
    form.setFieldsValue({
      durationDays: request.billingCycle === 'YEARLY' ? 365 : 30,
      expiresAt: null,
      monthlyMinutesLimitOverride: null,
      adminNote: '',
    })
  }, [request, mode, form])

  const handleOk = async () => {
    if (!request || !mode) return
    const values = await form.validateFields()
    if (mode === 'approve') {
      await approveMutation.mutateAsync({
        id: request.id,
        payload: {
          durationDays: values.durationDays ?? undefined,
          expiresAt: values.expiresAt
            ? appDayJs.toUTCISOString(values.expiresAt)
            : undefined,
          monthlyMinutesLimitOverride:
            values.monthlyMinutesLimitOverride !== undefined &&
            values.monthlyMinutesLimitOverride !== null
              ? Number(values.monthlyMinutesLimitOverride)
              : null,
          adminNote: values.adminNote?.trim() || null,
        },
      })
    } else {
      await rejectMutation.mutateAsync({
        id: request.id,
        payload: {
          adminNote: values.adminNote?.trim() || null,
        },
      })
    }
    onClose()
  }

  const isApprove = mode === 'approve'
  const price =
    request?.requestedPlan &&
    (request.billingCycle === 'YEARLY'
      ? request.requestedPlan.priceYearly
      : request.requestedPlan.priceMonthly)

  return (
    <Modal
      title={
        isApprove
          ? `Duyệt yêu cầu nâng cấp #${request?.id ?? ''}`
          : `Từ chối yêu cầu nâng cấp #${request?.id ?? ''}`
      }
      open={request !== null && mode !== null}
      width={620}
      okText={isApprove ? 'Duyệt & Kích hoạt gói' : 'Xác nhận từ chối'}
      cancelText="Hủy"
      okButtonProps={{ danger: !isApprove }}
      confirmLoading={isSubmitting}
      onOk={() => void handleOk()}
      onCancel={onClose}
    >
      {request && (
        <div className="flex flex-col gap-4">
          <Descriptions size="small" bordered column={1}>
            <Descriptions.Item label="Tenant">
              {request.tenant?.name ?? `Tenant #${request.tenantId}`}
              {request.tenant?.code ? ` (${request.tenant.code})` : ''}
            </Descriptions.Item>
            <Descriptions.Item label="Người gửi">
              {formatSaasUserName(request.user)}{' '}
              {request.user?.email ? `(${request.user.email})` : ''}
            </Descriptions.Item>
            <Descriptions.Item label="Gói yêu cầu">
              <strong>
                {request.requestedPlan?.name ??
                  `Plan #${request.requestedPlanId}`}
              </strong>{' '}
              <Tag color={BILLING_CYCLE_META[request.billingCycle].color}>
                {BILLING_CYCLE_META[request.billingCycle].label}
              </Tag>
              {typeof price === 'number' && (
                <span>
                  — {formatPlanPrice(price, request.requestedPlan?.currency)}
                </span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú từ khách hàng">
              {request.contactNote || '—'}
            </Descriptions.Item>
          </Descriptions>

          <Form<ActionFormValues> form={form} layout="vertical">
            {isApprove && (
              <>
                <Row gutter={12}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Thời hạn kích hoạt (ngày)"
                      name="durationDays"
                      tooltip="Mặc định 30 ngày cho gói tháng, 365 ngày cho gói năm"
                    >
                      <InputNumber<number>
                        min={1}
                        style={{ width: '100%' }}
                        suffix="ngày"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Hoặc ngày hết hạn cụ thể"
                      name="expiresAt"
                    >
                      <DatePicker
                        showTime
                        format="DD/MM/YYYY HH:mm"
                        style={{ width: '100%' }}
                        placeholder="Ưu tiên nếu được chọn"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Ghi đè hạn mức phút/tháng (tùy chọn)"
                  name="monthlyMinutesLimitOverride"
                >
                  <InputNumber<number>
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="Để trống để dùng hạn mức chuẩn của gói"
                    suffix="phút"
                  />
                </Form.Item>
              </>
            )}

            <Form.Item
              label={isApprove ? 'Ghi chú quản trị viên' : 'Lý do từ chối'}
              name="adminNote"
              rules={
                isApprove
                  ? []
                  : [{ required: true, message: 'Vui lòng nhập lý do từ chối' }]
              }
            >
              <Input.TextArea
                rows={3}
                placeholder={
                  isApprove
                    ? 'vd: Đã xác nhận thanh toán chuyển khoản'
                    : 'vd: Chưa nhận được thông tin xác nhận thanh toán'
                }
              />
            </Form.Item>
          </Form>
        </div>
      )}
    </Modal>
  )
}
