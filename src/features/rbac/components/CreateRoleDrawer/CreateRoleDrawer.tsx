import type { Role } from '#/shared/types/schema/Role'
import { Button, Col, Drawer, Row, Space, Steps } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import StepRoleInfo from './StepRoleInfo'
import StepRoleMembers from './StepRoleMembers'
import StepRolePermissions from './StepRolePermissions'
import StepRolePreview from './StepRolePreview'
import type { RoleFormData } from './types'
import { INITIAL_FORM_DATA } from './types'

interface CreateRoleDrawerProps {
  open: boolean
  editingRole?: Role | null
  onClose: () => void
  onSubmit: (data: RoleFormData) => void
  isSubmitting?: boolean
}

const getDrawerWidth = () => {
  if (typeof window === 'undefined') return 'calc(100vw - 80px)'
  const saved = localStorage.getItem('sidebar_collapsed')
  const isCollapsed = saved !== 'false'
  const sidebarWidth = isCollapsed ? 80 : 250
  return `calc(100vw - ${sidebarWidth}px)`
}

export default function CreateRoleDrawer({
  open,
  editingRole,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CreateRoleDrawerProps) {
  const [drawerWidth, setDrawerWidth] = useState<string>(getDrawerWidth)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [formData, setFormData] = useState<RoleFormData>(INITIAL_FORM_DATA)

  useEffect(() => {
    if (open) {
      setDrawerWidth(getDrawerWidth())
      if (editingRole) {
        setFormData({
          code: editingRole.code || '',
          name: editingRole.name || '',
          description: editingRole.description || '',
          selectedPermissions:
            editingRole.rolePermissions?.map((rp) => rp.permissionId) || [],
          selectedMemberIds:
            editingRole.userRoles?.map((ur) => String(ur.userId)) || [],
        })
      } else {
        setFormData(INITIAL_FORM_DATA)
      }
      setCurrentStep(0)
    }
  }, [open, editingRole])

  const handleClose = () => {
    if (isSubmitting) return
    setCurrentStep(0)
    setFormData(INITIAL_FORM_DATA)
    onClose()
  }

  const handleFieldChange = <K extends keyof RoleFormData>(
    field: K,
    value: RoleFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const isStep1Valid = useMemo(() => {
    return (
      formData.code.trim().length > 0 &&
      formData.name.trim().length > 0
    )
  }, [formData.code, formData.name])

  const isStep2Valid = useMemo(() => {
    return formData.selectedPermissions.length > 0
  }, [formData.selectedPermissions])

  const isCurrentStepValid = useMemo(() => {
    switch (currentStep) {
      case 0:
        return isStep1Valid
      case 1:
        return isStep2Valid
      case 2:
        return true
      default:
        return true
    }
  }, [currentStep, isStep1Valid, isStep2Valid])

  const handleNext = () => {
    if (!isCurrentStepValid) return
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handlePrev = () => {
    if (isSubmitting) return
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  const stepItems = [
    {
      title: 'Thông tin vai trò',
      description: 'Bắt buộc',
    },
    {
      title: 'Chọn quyền',
      description: 'Bắt buộc',
    },
    {
      title: 'Thêm thành viên',
      description: 'Không bắt buộc',
    },
    {
      title: 'Xem trước',
      description: 'Kiểm tra thông tin',
    },
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepRoleInfo
            data={formData}
            onChange={handleFieldChange}
          />
        )
      case 1:
        return (
          <StepRolePermissions
            selectedPermissions={formData.selectedPermissions}
            onChange={(perms) => handleFieldChange('selectedPermissions', perms)}
          />
        )
      case 2:
        return (
          <StepRoleMembers
            selectedMemberIds={formData.selectedMemberIds}
            onChange={(ids) => handleFieldChange('selectedMemberIds', ids)}
          />
        )
      case 3:
        return <StepRolePreview data={formData} />
      default:
        return null
    }
  }

  return (
    <Drawer
      title={editingRole ? 'Chỉnh sửa vai trò' : 'Tạo vai trò mới'}
      open={open}
      onClose={handleClose}
      width={drawerWidth}
      destroyOnClose
      styles={{
        body: {
          height: 'calc(100vh - 110px)',
          overflow: 'hidden',
          padding: 16,
        },
      }}
      footer={
        <Row justify="end" align="middle" gutter={[8, 8]}>
          <Col>
            <Space size={8}>
              {currentStep > 0 && (
                <Button onClick={handlePrev} disabled={isSubmitting}>
                  Trở về
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  type="primary"
                  onClick={handleNext}
                  disabled={!isCurrentStepValid}
                >
                  Tiếp theo
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                >
                  {editingRole ? 'Cập nhật vai trò' : 'Tạo vai trò'}
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      }
    >
      <Row gutter={[8, 8]} style={{ height: '100%' }}>
        <Col xs={24} md={6} style={{ height: '100%' }}>
          <div className="sticky top-0">
            <Steps
              direction="vertical"
              current={currentStep}
              items={stepItems}
              onChange={(step) => {
                if (isSubmitting) return
                if (step < currentStep) {
                  setCurrentStep(step)
                } else if (step === currentStep + 1 && isCurrentStepValid) {
                  setCurrentStep(step)
                }
              }}
            />
          </div>
        </Col>

        <Col
          xs={24}
          md={18}
          style={{
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <div className="w-full h-full overflow-hidden">
            {renderStepContent()}
          </div>
        </Col>
      </Row>
    </Drawer>
  )
}
