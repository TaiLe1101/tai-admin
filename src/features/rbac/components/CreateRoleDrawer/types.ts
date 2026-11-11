export interface RoleFormData {
  code: string
  name: string
  description: string
  selectedPermissions: number[]
  selectedMemberIds: string[]
}

export interface MemberItem {
  id: string
  fullName: string
}

export const MOCK_MEMBERS: MemberItem[] = [
  { id: '1', fullName: 'Nguyễn Văn An' },
  { id: '2', fullName: 'Trần Thị Bình' },
  { id: '3', fullName: 'Lê Hoàng Cường' },
  { id: '4', fullName: 'Phạm Thị Dung' },
  { id: '5', fullName: 'Võ Minh Đức' },
  { id: '6', fullName: 'Đặng Ngọc Hân' },
  { id: '7', fullName: 'Bùi Quang Khải' },
  { id: '8', fullName: 'Hoàng Thị Lan' },
]

export const INITIAL_FORM_DATA: RoleFormData = {
  code: '',
  name: '',
  description: '',
  selectedPermissions: [],
  selectedMemberIds: [],
}
