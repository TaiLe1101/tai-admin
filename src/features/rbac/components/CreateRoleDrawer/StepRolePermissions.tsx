import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import type { PermissionItemRes } from '#/features/rbac/api/dto/res/getPermissionsRes'
import useGetPermissions from '#/features/rbac/queries/useGetPermissions'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Empty,
  Input,
  Row,
  Space,
  Spin,
  Tooltip,
  Typography,
} from 'antd'
import { useMemo, useState } from 'react'

interface PermissionGroup {
  name: string
  permissions: PermissionItemRes[]
  allIds: number[]
}

interface StepRolePermissionsProps {
  selectedPermissions: number[]
  onChange?: (permissions: number[]) => void
  readOnly?: boolean
}

export default function StepRolePermissions({
  selectedPermissions,
  onChange,
  readOnly = false,
}: StepRolePermissionsProps) {
  const { data: permissionsData, isLoading } = useGetPermissions()
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  const selectedSet = useMemo(
    () => new Set(selectedPermissions),
    [selectedPermissions],
  )

  const permissionGroups = useMemo<PermissionGroup[]>(() => {
    if (!permissionsData || permissionsData.length === 0) return []
    const groupMap = new Map<string, PermissionGroup>()

    permissionsData.forEach((perm) => {
      if (!groupMap.has(perm.group)) {
        groupMap.set(perm.group, {
          name: perm.group,
          permissions: [],
          allIds: [],
        })
      }

      const group = groupMap.get(perm.group)!
      group.permissions.push(perm)
      group.allIds.push(perm.id)
    })

    return Array.from(groupMap.values())
  }, [permissionsData])

  const allSystemIds = useMemo(() => {
    return permissionsData?.map((p) => p.id) ?? []
  }, [permissionsData])

  const totalPermissionsCount = allSystemIds.length

  const isAllSelected =
    totalPermissionsCount > 0 &&
    selectedPermissions.length === totalPermissionsCount

  const handleToggleId = (id: number, checked: boolean) => {
    if (readOnly || !onChange) return
    if (checked) {
      onChange([...selectedPermissions, id])
    } else {
      onChange(selectedPermissions.filter((item) => item !== id))
    }
  }

  const handleToggleGroup = (group: PermissionGroup, checked: boolean) => {
    if (readOnly || !onChange) return
    const groupIdsSet = new Set(group.allIds)
    if (checked) {
      const merged = Array.from(new Set([...selectedPermissions, ...group.allIds]))
      onChange(merged)
    } else {
      onChange(selectedPermissions.filter((id) => !groupIdsSet.has(id)))
    }
  }

  const handleToggleAll = () => {
    if (readOnly || !onChange) return
    if (isAllSelected) {
      onChange([])
    } else {
      onChange([...allSystemIds])
    }
  }

  const handleReset = () => {
    if (readOnly || !onChange) return
    onChange([])
  }

  const filteredGroups = useMemo(() => {
    if (!searchKeyword.trim()) return permissionGroups
    const keyword = searchKeyword.trim().toLowerCase()

    return permissionGroups
      .map((group) => {
        const groupNameMatch = group.name.toLowerCase().includes(keyword)
        const matchedPermissions = group.permissions.filter(
          (p) =>
            groupNameMatch ||
            p.name.toLowerCase().includes(keyword) ||
            p.code.toLowerCase().includes(keyword),
        )

        return {
          ...group,
          permissions: matchedPermissions,
        }
      })
      .filter((group) => group.permissions.length > 0)
  }, [permissionGroups, searchKeyword])

  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-hidden">
      {/* Thanh công cụ ở trên: hoàn toàn cố định, không bị ảnh hưởng khi cuộn */}
      <div className="shrink-0 pb-1">
        <Row justify="space-between" align="middle" gutter={[8, 8]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm quyền hạn..."
              prefix={<SearchOutlined />}
              allowClear
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </Col>

          <Col>
            <Space size={8} align="center">
              <Typography.Text type="secondary">
                Đã chọn:{' '}
                <Typography.Text style={{ color: '#1677ff', fontWeight: 600 }}>
                  {selectedPermissions.length}
                </Typography.Text>
                /{totalPermissionsCount} quyền
              </Typography.Text>

              {!readOnly && (
                <>
                  <Divider type="vertical" />
                  <Button onClick={handleToggleAll}>
                    {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </Button>
                  <Tooltip title="Đặt lại lựa chọn">
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={handleReset}
                    />
                  </Tooltip>
                </>
              )}
            </Space>
          </Col>
        </Row>
      </div>

      {/* Danh sách nhóm quyền chia 2 cột: cuộn độc lập bên dưới filter */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <Spin tip="Đang tải danh sách quyền..." />
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <Empty description="Không tìm thấy quyền hạn phù hợp" />
          </div>
        ) : (
          <Row gutter={[8, 8]}>
            {filteredGroups.map((group) => {
              const groupSelectedCount = group.allIds.filter((id) =>
                selectedSet.has(id),
              ).length
              const allSelected =
                group.allIds.length > 0 &&
                groupSelectedCount === group.allIds.length
              const indeterminate =
                groupSelectedCount > 0 &&
                groupSelectedCount < group.allIds.length

              return (
                <Col xs={24} md={12} key={group.name}>
                  <Card
                    size="small"
                    style={{ height: 225 }}
                    title={
                      <Row justify="space-between" align="middle" gutter={[8, 8]}>
                        <Col>
                          <Checkbox
                            disabled={readOnly}
                            checked={allSelected}
                            indeterminate={indeterminate}
                            onChange={(e) =>
                              handleToggleGroup(group, e.target.checked)
                            }
                          >
                            <Typography.Text strong>{group.name}</Typography.Text>
                          </Checkbox>
                        </Col>
                        <Col>
                          <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600 font-medium">
                            {groupSelectedCount}/{group.allIds.length}
                          </span>
                        </Col>
                      </Row>
                    }
                    styles={{
                      body: {
                        height: 185,
                        overflowY: 'auto',
                        padding: 12,
                      },
                    }}
                  >
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                      {group.permissions.map((perm) => (
                        <Tooltip key={perm.id} title={perm.description || undefined}>
                          <Checkbox
                            disabled={readOnly}
                            checked={selectedSet.has(perm.id)}
                            onChange={(e) =>
                              handleToggleId(perm.id, e.target.checked)
                            }
                          >
                            {perm.name}
                          </Checkbox>
                        </Tooltip>
                      ))}
                    </Space>
                  </Card>
                </Col>
              )
            })}
          </Row>
        )}
      </div>
    </div>
  )
}
