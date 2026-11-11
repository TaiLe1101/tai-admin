import { Input, Table } from 'antd'
import type { TableProps } from 'antd'
import { useMemo, useState } from 'react'
import { MOCK_MEMBERS } from './types'
import type { MemberItem } from './types'

interface StepRoleMembersProps {
  selectedMemberIds: string[]
  onChange: (memberIds: string[]) => void
}

export default function StepRoleMembers({
  selectedMemberIds,
  onChange,
}: StepRoleMembersProps) {
  const [searchText, setSearchText] = useState<string>('')

  const filteredMembers = useMemo(() => {
    if (!searchText.trim()) return MOCK_MEMBERS
    const lower = searchText.trim().toLowerCase()
    return MOCK_MEMBERS.filter((m) => m.fullName.toLowerCase().includes(lower))
  }, [searchText])

  const columns: TableProps<MemberItem>['columns'] = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
  ]

  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-hidden">
      {/* Thanh tìm kiếm cố định */}
      <div className="shrink-0 pb-1">
        <Input.Search
          placeholder="Tìm kiếm người dùng theo họ và tên"
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Bảng danh sách người dùng cuộn độc lập */}
      <div className="flex-1 overflow-y-auto pr-1">
        <Table<MemberItem>
          rowKey="id"
          rowSelection={{
            selectedRowKeys: selectedMemberIds,
            onChange: (keys) => onChange(keys as string[]),
          }}
          columns={columns}
          dataSource={filteredMembers}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} người dùng`,
          }}
          size="small"
        />
      </div>
    </div>
  )
}
