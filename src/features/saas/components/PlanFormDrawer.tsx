import { useEffect } from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Switch,
  Typography,
} from 'antd'
import type { CreatePlanReq, PlanDto } from '../api/dto/saasTypes'
import { useCreateSaasPlan, useUpdateSaasPlan } from '../hooks/useSaasMutations'

interface PlanFormValues {
  code: string
  name: string
  description?: string
  badge?: string
  priceMonthly: number
  priceYearly: number
  currency: string
  isUnlimited: boolean
  monthlyMinutesLimit?: number | null
  maxSeats: number
  features: string[]
  isPublic: boolean
  isDefault: boolean
  isHighlighted: boolean
  sortOrder: number
  isActive: boolean
}

interface PlanFormDrawerProps {
  open: boolean
  plan: PlanDto | null
  onClose: () => void
}

const numberFormatter = (value?: number | string) =>
  value !== undefined && `${value}` !== ''
    ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    : ''

const numberParser = (value?: string): number => {
  const cleaned = (value ?? '').replace(/[^\d]/g, '')
  return cleaned ? Number(cleaned) : 0
}

export default function PlanFormDrawer({
  open,
  plan,
  onClose,
}: PlanFormDrawerProps) {
  const [form] = Form.useForm<PlanFormValues>()
  const isUnlimited = Form.useWatch('isUnlimited', form)
  const createMutation = useCreateSaasPlan()
  const updateMutation = useUpdateSaasPlan()
  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const isEdit = plan !== null

  useEffect(() => {
    if (!open) return
    if (plan) {
      form.setFieldsValue({
        code: plan.code,
        name: plan.name,
        description: plan.description ?? '',
        badge: plan.badge ?? '',
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        currency: plan.currency || 'VND',
        isUnlimited: plan.monthlyMinutesLimit === null,
        monthlyMinutesLimit: plan.monthlyMinutesLimit ?? 60,
        maxSeats: plan.maxSeats,
        features: plan.features.length > 0 ? plan.features : [''],
        isPublic: plan.isPublic,
        isDefault: plan.isDefault,
        isHighlighted: plan.isHighlighted,
        sortOrder: plan.sortOrder,
        isActive: plan.isActive,
      })
    } else {
      form.setFieldsValue({
        code: '',
        name: '',
        description: '',
        badge: '',
        priceMonthly: 0,
        priceYearly: 0,
        currency: 'VND',
        isUnlimited: false,
        monthlyMinutesLimit: 60,
        maxSeats: 1,
        features: [''],
        isPublic: true,
        isDefault: false,
        isHighlighted: false,
        sortOrder: 0,
        isActive: true,
      })
    }
  }, [open, plan, form])

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const cleanedFeatures = values.features
      .map((item) => item.trim())
      .filter((item) => Boolean(item))

    const payload: CreatePlanReq = {
      code: values.code.trim(),
      name: values.name.trim(),
      description: values.description?.trim() || null,
      badge: values.badge?.trim() || null,
      priceMonthly: Number(values.priceMonthly),
      priceYearly: Number(values.priceYearly),
      currency: values.currency.trim() || 'VND',
      monthlyMinutesLimit: values.isUnlimited
        ? null
        : Number(values.monthlyMinutesLimit ?? 0),
      maxSeats: Number(values.maxSeats),
      features: cleanedFeatures,
      isPublic: Boolean(values.isPublic),
      isDefault: Boolean(values.isDefault),
      isHighlighted: Boolean(values.isHighlighted),
      sortOrder: Number(values.sortOrder),
      isActive: Boolean(values.isActive),
    }

    if (plan) {
      await updateMutation.mutateAsync({ id: plan.id, payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    onClose()
  }

  return (
    <Drawer
      title={isEdit ? `Chỉnh sửa gói: ${plan.name}` : 'Tạo gói dịch vụ mới'}
      open={open}
      width={680}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            type="primary"
            loading={isSubmitting}
            onClick={() => void handleSubmit()}
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo gói'}
          </Button>
        </Space>
      }
    >
      <Form<PlanFormValues> form={form} layout="vertical">
        <Row gutter={12}>
          <Col xs={24} sm={10}>
            <Form.Item
              label="Mã gói (code)"
              name="code"
              rules={[
                { required: true, message: 'Vui lòng nhập mã gói' },
                {
                  pattern: /^[a-z0-9][a-z0-9_-]*$/,
                  message: 'Chỉ dùng chữ thường, số, dấu gạch ngang hoặc gạch dưới',
                },
              ]}
            >
              <Input placeholder="vd: free, pro, team" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={14}>
            <Form.Item
              label="Tên gói"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên gói' }]}
            >
              <Input placeholder="vd: Pro, Team" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item label="Nhãn nổi bật (badge)" name="badge">
              <Input placeholder="vd: Phổ biến nhất, Đội nhóm" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item label="Đơn vị tiền tệ" name="currency">
              <Input placeholder="VND" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item label="Thứ tự hiển thị" name="sortOrder">
              <InputNumber<number> min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Mô tả ngắn" name="description">
          <Input.TextArea
            rows={2}
            placeholder="Mô tả lợi ích chính của gói dịch vụ..."
          />
        </Form.Item>

        <Divider titlePlacement="left" style={{ margin: '12px 0' }}>
          Giá & Hạn mức
        </Divider>

        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Giá theo tháng (VND)"
              name="priceMonthly"
              rules={[{ required: true, message: 'Vui lòng nhập giá tháng' }]}
            >
              <InputNumber<number>
                min={0}
                step={10000}
                style={{ width: '100%' }}
                formatter={numberFormatter}
                parser={numberParser}
                suffix="₫"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Giá theo năm (VND)"
              name="priceYearly"
              rules={[{ required: true, message: 'Vui lòng nhập giá năm' }]}
            >
              <InputNumber<number>
                min={0}
                step={50000}
                style={{ width: '100%' }}
                formatter={numberFormatter}
                parser={numberParser}
                suffix="₫"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12} align="middle">
          <Col xs={24} sm={8}>
            <Form.Item
              label="Không giới hạn phút"
              name="isUnlimited"
              valuePropName="checked"
            >
              <Switch checkedChildren="Không giới hạn" unCheckedChildren="Giới hạn" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Hạn mức phút / tháng"
              name="monthlyMinutesLimit"
              rules={
                isUnlimited
                  ? []
                  : [
                      {
                        required: true,
                        message: 'Nhập số phút/tháng hoặc bật không giới hạn',
                      },
                    ]
              }
            >
              <InputNumber<number>
                min={0}
                step={60}
                disabled={Boolean(isUnlimited)}
                style={{ width: '100%' }}
                formatter={numberFormatter}
                parser={numberParser}
                placeholder={isUnlimited ? 'Không giới hạn' : 'vd: 600'}
                suffix="phút"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Số thành viên tối đa"
              name="maxSeats"
              rules={[{ required: true, message: 'Nhập số thành viên' }]}
            >
              <InputNumber<number> min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider titlePlacement="left" style={{ margin: '12px 0' }}>
          Danh sách tính năng
        </Divider>

        <Form.List name="features">
          {(fields, { add, remove }) => (
            <div className="flex flex-col gap-2 mb-4">
              {fields.map((field, index) => (
                <Space
                  key={field.key}
                  align="baseline"
                  style={{ display: 'flex', width: '100%' }}
                  styles={{ item: { flex: 1 } }}
                >
                  <Form.Item
                    {...field}
                    style={{ marginBottom: 4, width: '100%' }}
                  >
                    <Input
                      placeholder={`Tính năng #${index + 1} (vd: 600 phút lồng tiếng AI/tháng)`}
                    />
                  </Form.Item>
                  <Button
                    type="text"
                    danger
                    icon={<MinusCircleOutlined />}
                    aria-label="Xóa tính năng"
                    onClick={() => remove(field.name)}
                    style={{ flex: 'none' }}
                  />
                </Space>
              ))}
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => add('')}
                block
              >
                Thêm dòng tính năng
              </Button>
            </div>
          )}
        </Form.List>

        <Divider titlePlacement="left" style={{ margin: '12px 0' }}>
          Trạng thái hiển thị
        </Divider>

        <Row gutter={[12, 8]}>
          <Col xs={12} sm={6}>
            <Form.Item
              label="Hiển thị công khai"
              name="isPublic"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item
              label="Nổi bật (Highlight)"
              name="isHighlighted"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item
              label="Gói mặc định"
              name="isDefault"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item
              label="Đang kích hoạt"
              name="isActive"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Gói mặc định sẽ tự động gán cho người dùng khi đăng ký tài khoản mới
          trên ứng dụng TAI Desktop.
        </Typography.Text>
      </Form>
    </Drawer>
  )
}
