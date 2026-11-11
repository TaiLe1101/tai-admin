import type { CreateRoleReq } from '#/features/rbac/api/dto/req/createRoleReq'
import type { RoleFormData } from '#/features/rbac/components/CreateRoleDrawer'
import { CreateRoleDrawer } from '#/features/rbac/components/CreateRoleDrawer'
import useCreateRole from '#/features/rbac/hooks/useCreateRole'
import useGetRoles from '#/features/rbac/queries/useGetRoles'
import type { Role } from '#/shared/types/schema/Role'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import type { TableProps } from 'antd'
import { Button, Col, Input, Popconfirm, Row, Space, Table, Tooltip } from 'antd'
import { useEffect, useMemo, useState } from 'react'

const routeApi = getRouteApi('/_main-layout/settings/rbac/')

export default function RBACPage() {
  const searchParams = routeApi.useSearch()
  const navigate = useNavigate()
  const { search, page, limit } = searchParams

  const currentSearch = search ?? ''
  const [searchValue, setSearchValue] = useState<string>(currentSearch)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const { data: rolesData, isPending: isGetRolesPending } = useGetRoles()
  const createRoleMutation = useCreateRole()

  useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  const handleSearch = (value: string) => {
    const trimmed = value.trim()
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        search: trimmed || undefined,
      }),
    })
  }

  const handleDelete = (_id: number) => {
    // Delete role handler
  }

  const handleEdit = (record: Role) => {
    setEditingRole(record)
    setIsDrawerOpen(true)
  }

  const handleOpenCreate = () => {
    setEditingRole(null)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setEditingRole(null)
  }

  const handleSubmitRole = (data: RoleFormData) => {
    if (editingRole) {
      // Future edit logic
      setIsDrawerOpen(false)
      setEditingRole(null)
    } else {
      const payload: CreateRoleReq = {
        code: data.code.trim(),
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        permissionIds: data.selectedPermissions,
        userIds:
          data.selectedMemberIds.length > 0
            ? data.selectedMemberIds.map(Number).filter((id) => !Number.isNaN(id))
            : undefined,
      }

      createRoleMutation.mutate(payload, {
        onSuccess: () => {
          setIsDrawerOpen(false)
          setEditingRole(null)
        },
      })
    }
  }

  const filteredRoles = useMemo(() => {
    if (!currentSearch) return rolesData
    const lowerKeyword = currentSearch.toLowerCase()
    return rolesData?.filter((role) =>
      role.name.toLowerCase().includes(lowerKeyword),
    )
  }, [rolesData, currentSearch])

  const columns: TableProps<Role>['columns'] = [
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Chỉnh sửa vai trò">
            <Button
              type="text"
              onClick={() => handleEdit(record)}
            >
              Chỉnh sửa
            </Button>
          </Tooltip>
          <Popconfirm
            title="Xóa vai trò"
            description="Bạn có chắc chắn muốn xóa vai trò này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa vai trò">
              <Button type="text" danger>
                Xóa
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="w-full">
      <Row gutter={[0, 8]}>
        <Col span={24}>
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs pb-2">
            <Row justify="space-between" align="middle" gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Input.Search
                  placeholder="Tìm kiếm vai trò"
                  allowClear
                  value={searchValue}
                  onChange={(e) => {
                    const val = e.target.value
                    setSearchValue(val)
                    if (!val) {
                      handleSearch('')
                    }
                  }}
                  onSearch={handleSearch}
                />
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={handleOpenCreate}
                >
                  Tạo vai trò mới
                </Button>
              </Col>
            </Row>
          </div>
        </Col>

        <Col span={24}>
          <Table<Role>
            columns={columns}
            dataSource={filteredRoles}
            rowKey="id"
            scroll={{ x: 'max-content', y: 'calc(100vh - 240px)' }}
            loading={isGetRolesPending}
            pagination={{
              current: page,
              pageSize: limit,
              showSizeChanger: true,
              onChange: (current, pageSize) => {
                navigate({
                  to: '.',
                  search: (prev) => ({
                    ...prev,
                    page: current,
                    limit: pageSize,
                  }),
                  replace: true,
                })
              },
            }}
          />
        </Col>
      </Row>

      <CreateRoleDrawer
        open={isDrawerOpen}
        editingRole={editingRole}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmitRole}
        isSubmitting={createRoleMutation.isPending}
      />
    </div>
  )
}
