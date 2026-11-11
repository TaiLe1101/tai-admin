/**
 * ============================================================================
 * TẬP TIN ĐỒNG BỘ TỰ ĐỘNG TỪ BACKEND
 * Nguồn: safe-care-api/src/common/constants/permissions.constant.ts
 * Đích:  safe-care-admin/src/shared/constants/permissions.ts
 *
 * CẢNH BÁO: KHÔNG CHỈNH SỬA FILE NÀY TRỰC TIẾP!
 * Mọi thay đổi nên được thực hiện ở Backend và sau đó chạy lệnh đồng bộ:
 *   - Tại thư mục gốc: npm run sync:permissions
 *   - Hoặc: node scripts/sync-permissions.mjs
 * ============================================================================
 */

export const PERMISSIONS = {
  SYSTEM_USERS: {
    VIEW: 'system_users:view',
    CREATE: 'system_users:create',
    UPDATE: 'system_users:update',
    DELETE: 'system_users:delete',
  },
  ROLES: {
    VIEW: 'roles:view',
    CREATE: 'roles:create',
    UPDATE: 'roles:update',
    DELETE: 'roles:delete',
    ASSIGN: 'roles:assign',
  },
  EDUCATION_LEVEL: {
    VIEW: 'education_level:view',
    CREATE: 'education_level:create',
    UPDATE: 'education_level:update',
    DELETE: 'education_level:delete',
  },
  PATIENT_VISIT_EMPLOYEE: {
    VIEW: 'patient_visit_employee:view',
    CREATE: 'patient_visit_employee:create',
    UPDATE: 'patient_visit_employee:update',
    DELETE: 'patient_visit_employee:delete',
  },
  PATIENTS: {
    VIEW: 'patient:view',
    CREATE: 'patient:create',
    UPDATE: 'patient:update',
    DELETE: 'patient:delete',
  },
  CARE_ASSIGNMENT: {
    VIEW: 'care_assignment:view',
    CREATE: 'care_assignment:create',
    UPDATE: 'care_assignment:update',
    DELETE: 'care_assignment:delete',
    ASIGN: 'care_assignment:asign', // Gán người nuôi bệnh
  },
  HOSPITALS: {
    VIEW: 'hospitals:view',
    UPDATE: 'hospitals:update',
  },
  HOSPITAL_DEPARTMENTS: {
    VIEW: 'hospital_departments:view',
    CREATE: 'hospital_departments:create',
    UPDATE: 'hospital_departments:update',
    DELETE: 'hospital_departments:delete',
  },
  HOSPITAL_ROOMS: {
    VIEW: 'hospital_rooms:view',
    CREATE: 'hospital_rooms:create',
    UPDATE: 'hospital_rooms:update',
    DELETE: 'hospital_rooms:delete',
  },

  PATIENT_VISITATIONS: {
    VIEW: 'patient_visitations:view',
    CREATE: 'patient_visitations:create',
    UPDATE: 'patient_visitations:update',
    DELETE: 'patient_visitations:delete',
    VERIFY_CHECKIN_CHECKOUT: 'patient_visitations:verify_checkin_checkout',
  },

  SETTINGS: {
    MANAGER: 'settings:manager',
  },
  LOGIN_LOGS: {
    VIEW: 'login_logs:view',
  },
  RELATIONSHIPS: {
    VIEW: 'relationships:view',
    CREATE: 'relationships:create',
    UPDATE: 'relationships:update',
    DELETE: 'relationships:delete',
  },
  GATE_DASHBOARD: {
    VIEW: 'gate_dashboard:view',
  },
  VISITING_SHIFTS: {
    VIEW: 'visiting_shifts:view',
    CREATE: 'visiting_shifts:create',
    UPDATE: 'visiting_shifts:update',
    DELETE: 'visiting_shifts:delete',
  },
} as const

type NestedValue<T> =
  T extends Record<string, infer U>
    ? U extends Record<string, unknown>
      ? NestedValue<U>
      : string
    : never

export type PermissionCode = NestedValue<typeof PERMISSIONS>

export const SYSTEM_PERMISSIONS_METADATA = [
  // USERS
  {
    code: PERMISSIONS.SYSTEM_USERS.VIEW,
    name: 'Xem người dùng',
    description: 'Xem danh sách và thông tin người dùng',
    group: 'Người dùng',
  },
  {
    code: PERMISSIONS.SYSTEM_USERS.CREATE,
    name: 'Tạo người dùng',
    description: 'Tạo mới người dùng',
    group: 'Người dùng',
  },
  {
    code: PERMISSIONS.SYSTEM_USERS.UPDATE,
    name: 'Cập nhật người dùng',
    description: 'Chỉnh sửa thông tin người dùng',
    group: 'Người dùng',
  },
  {
    code: PERMISSIONS.SYSTEM_USERS.DELETE,
    name: 'Xóa người dùng',
    description: 'Xóa người dùng khỏi hệ thống',
    group: 'Người dùng',
  },

  // ROLES
  {
    code: PERMISSIONS.ROLES.VIEW,
    name: 'Xem vai trò',
    description: 'Xem danh sách vai trò hệ thống',
    group: 'Vai trò',
  },
  {
    code: PERMISSIONS.ROLES.CREATE,
    name: 'Tạo vai trò',
    description: 'Tạo mới vai trò hệ thống',
    group: 'Vai trò',
  },
  {
    code: PERMISSIONS.ROLES.UPDATE,
    name: 'Cập nhật vai trò',
    description: 'Chỉnh sửa thông tin vai trò',
    group: 'Vai trò',
  },
  {
    code: PERMISSIONS.ROLES.DELETE,
    name: 'Xóa vai trò',
    description: 'Xóa vai trò khỏi hệ thống',
    group: 'Vai trò',
  },
  {
    code: PERMISSIONS.ROLES.ASSIGN,
    name: 'Gán quyền vai trò',
    description: 'Gán và phân quyền cho vai trò',
    group: 'Vai trò',
  },

  // LOGIN LOGS
  {
    code: PERMISSIONS.LOGIN_LOGS.VIEW,
    name: 'Xem lịch sử đăng nhập',
    description: 'Xem danh sách lịch sử đăng nhập hệ thống',
    group: 'Nhật ký hệ thống',
  },

  // EDUCATION LEVEL
  {
    code: PERMISSIONS.EDUCATION_LEVEL.VIEW,
    name: 'Xem trình độ học vấn',
    description: 'Xem danh sách trình độ học vấn',
    group: 'Trình độ học vấn',
  },
  {
    code: PERMISSIONS.EDUCATION_LEVEL.CREATE,
    name: 'Tạo trình độ học vấn',
    description: 'Tạo mới trình độ học vấn',
    group: 'Trình độ học vấn',
  },
  {
    code: PERMISSIONS.EDUCATION_LEVEL.UPDATE,
    name: 'Cập nhật trình độ học vấn',
    description: 'Chỉnh sửa thông tin trình độ học vấn',
    group: 'Trình độ học vấn',
  },
  {
    code: PERMISSIONS.EDUCATION_LEVEL.DELETE,
    name: 'Xóa trình độ học vấn',
    description: 'Xóa trình độ học vấn khỏi hệ thống',
    group: 'Trình độ học vấn',
  },

  // PATIENT VISIT EMPLOYEE
  {
    code: PERMISSIONS.PATIENT_VISIT_EMPLOYEE.VIEW,
    name: 'Xem người nuôi bệnh',
    description: 'Xem danh sách và thông tin người nuôi bệnh',
    group: 'Người nuôi bệnh',
  },
  {
    code: PERMISSIONS.PATIENT_VISIT_EMPLOYEE.CREATE,
    name: 'Tạo người nuôi bệnh',
    description: 'Tạo mới người nuôi bệnh',
    group: 'Người nuôi bệnh',
  },
  {
    code: PERMISSIONS.PATIENT_VISIT_EMPLOYEE.UPDATE,
    name: 'Cập nhật người nuôi bệnh',
    description: 'Chỉnh sửa thông tin người nuôi bệnh',
    group: 'Người nuôi bệnh',
  },
  {
    code: PERMISSIONS.PATIENT_VISIT_EMPLOYEE.DELETE,
    name: 'Xóa người nuôi bệnh',
    description: 'Xóa người nuôi bệnh khỏi hệ thống',
    group: 'Người nuôi bệnh',
  },

  // PATIENT
  {
    code: PERMISSIONS.PATIENTS.VIEW,
    name: 'Xem bệnh nhân',
    description: 'Xem danh sách và thông tin bệnh nhân',
    group: 'Bệnh nhân',
  },
  {
    code: PERMISSIONS.PATIENTS.CREATE,
    name: 'Tạo bệnh nhân',
    description: 'Tạo mới bệnh nhân',
    group: 'Bệnh nhân',
  },
  {
    code: PERMISSIONS.PATIENTS.UPDATE,
    name: 'Cập nhật bệnh nhân',
    description: 'Chỉnh sửa thông tin bệnh nhân',
    group: 'Bệnh nhân',
  },
  {
    code: PERMISSIONS.PATIENTS.DELETE,
    name: 'Xóa bệnh nhân',
    description: 'Xóa bệnh nhân khỏi hệ thống',
    group: 'Bệnh nhân',
  },

  // CARE ASSIGNMENT
  {
    code: PERMISSIONS.CARE_ASSIGNMENT.VIEW,
    name: 'Xem phân công chăm sóc',
    description: 'Xem danh sách và thông tin phân công chăm sóc',
    group: 'Phân công chăm sóc',
  },
  {
    code: PERMISSIONS.CARE_ASSIGNMENT.CREATE,
    name: 'Tạo phân công chăm sóc',
    description: 'Tạo mới phân công chăm sóc',
    group: 'Phân công chăm sóc',
  },
  {
    code: PERMISSIONS.CARE_ASSIGNMENT.UPDATE,
    name: 'Cập nhật phân công chăm sóc',
    description: 'Chỉnh sửa thông tin phân công chăm sóc',
    group: 'Phân công chăm sóc',
  },
  {
    code: PERMISSIONS.CARE_ASSIGNMENT.DELETE,
    name: 'Xóa phân công chăm sóc',
    description: 'Xóa phân công chăm sóc khỏi hệ thống',
    group: 'Phân công chăm sóc',
  },
  {
    code: PERMISSIONS.CARE_ASSIGNMENT.ASIGN,
    name: 'Phân công chăm sóc',
    description: 'Phân công chăm sóc',
    group: 'Phân công chăm sóc',
  },

  // HOSPITALS
  {
    code: PERMISSIONS.HOSPITALS.VIEW,
    name: 'Xem thông tin bệnh viện',
    description: 'Xem thông tin cấu hình bệnh viện',
    group: 'Bệnh viện',
  },
  {
    code: PERMISSIONS.HOSPITALS.UPDATE,
    name: 'Cập nhật cấu hình bệnh viện',
    description: 'Chỉnh sửa thông tin cấu hình bệnh viện',
    group: 'Bệnh viện',
  },

  // HOSPITAL DEPARTMENTS
  {
    code: PERMISSIONS.HOSPITAL_DEPARTMENTS.VIEW,
    name: 'Xem khoa phòng bệnh viện',
    description: 'Xem danh sách và thông tin khoa phòng bệnh viện',
    group: 'Khoa phòng bệnh viện',
  },
  {
    code: PERMISSIONS.HOSPITAL_DEPARTMENTS.CREATE,
    name: 'Tạo khoa phòng bệnh viện',
    description: 'Tạo mới khoa phòng bệnh viện',
    group: 'Khoa phòng bệnh viện',
  },
  {
    code: PERMISSIONS.HOSPITAL_DEPARTMENTS.UPDATE,
    name: 'Cập nhật khoa phòng bệnh viện',
    description: 'Chỉnh sửa thông tin khoa phòng bệnh viện',
    group: 'Khoa phòng bệnh viện',
  },
  {
    code: PERMISSIONS.HOSPITAL_DEPARTMENTS.DELETE,
    name: 'Xóa khoa phòng bệnh viện',
    description: 'Xóa khoa phòng bệnh viện khỏi hệ thống',
    group: 'Khoa phòng bệnh viện',
  },

  // HOSPITAL ROOMS
  {
    code: PERMISSIONS.HOSPITAL_ROOMS.VIEW,
    name: 'Xem phòng bệnh viện',
    description: 'Xem danh sách và thông tin phòng bệnh viện',
    group: 'Phòng bệnh viện',
  },
  {
    code: PERMISSIONS.HOSPITAL_ROOMS.CREATE,
    name: 'Tạo phòng bệnh viện',
    description: 'Tạo mới phòng bệnh viện',
    group: 'Phòng bệnh viện',
  },
  {
    code: PERMISSIONS.HOSPITAL_ROOMS.UPDATE,
    name: 'Cập nhật phòng bệnh viện',
    description: 'Chỉnh sửa thông tin phòng bệnh viện',
    group: 'Phòng bệnh viện',
  },
  {
    code: PERMISSIONS.HOSPITAL_ROOMS.DELETE,
    name: 'Xóa phòng bệnh viện',
    description: 'Xóa phòng bệnh viện khỏi hệ thống',
    group: 'Phòng bệnh viện',
  },

  // PATIENT VISITATION
  {
    code: PERMISSIONS.PATIENT_VISITATIONS.VIEW,
    name: 'Xem phiếu thăm bệnh',
    description: 'Xem danh sách và thông tin phiếu thăm bệnh',
    group: 'Phiếu thăm bệnh',
  },
  {
    code: PERMISSIONS.PATIENT_VISITATIONS.CREATE,
    name: 'Tạo phiếu thăm bệnh',
    description: 'Tạo mới phiếu thăm bệnh',
    group: 'Phiếu thăm bệnh',
  },
  {
    code: PERMISSIONS.PATIENT_VISITATIONS.UPDATE,
    name: 'Cập nhật phiếu thăm bệnh',
    description: 'Chỉnh sửa thông tin phiếu thăm bệnh',
    group: 'Phiếu thăm bệnh',
  },
  {
    code: PERMISSIONS.PATIENT_VISITATIONS.DELETE,
    name: 'Xóa phiếu thăm bệnh',
    description: 'Xóa phiếu thăm bệnh khỏi hệ thống',
    group: 'Phiếu thăm bệnh',
  },
  {
    code: PERMISSIONS.PATIENT_VISITATIONS.VERIFY_CHECKIN_CHECKOUT,
    name: 'Xác nhận check-in/check-out',
    description: 'Xác nhận check-in/check-out phiếu thăm bệnh',
    group: 'Phiếu thăm bệnh',
  },

  // RELATIONSHIPS
  {
    code: PERMISSIONS.RELATIONSHIPS.VIEW,
    name: 'Xem mối quan hệ',
    description: 'Xem danh sách mối quan hệ',
    group: 'Mối quan hệ',
  },
  {
    code: PERMISSIONS.RELATIONSHIPS.CREATE,
    name: 'Tạo mối quan hệ',
    description: 'Tạo mới mối quan hệ',
    group: 'Mối quan hệ',
  },
  {
    code: PERMISSIONS.RELATIONSHIPS.UPDATE,
    name: 'Cập nhật mối quan hệ',
    description: 'Chỉnh sửa thông tin mối quan hệ',
    group: 'Mối quan hệ',
  },
  {
    code: PERMISSIONS.RELATIONSHIPS.DELETE,
    name: 'Xóa mối quan hệ',
    description: 'Xóa mối quan hệ khỏi hệ thống',
    group: 'Mối quan hệ',
  },

  // SETTINGS
  {
    code: PERMISSIONS.SETTINGS.MANAGER,
    name: 'Quản lý cấu hình',
    description: 'Quản lý cấu hình hệ thống',
    group: 'Cấu hình',
  },

  // GATE DASHBOARD
  {
    code: PERMISSIONS.GATE_DASHBOARD.VIEW,
    name: 'Xem thông tin cổng kiểm soát',
    description: 'Xem số liệu và danh sách người vào ra cổng',
    group: 'Cổng kiểm soát',
  },

  // VISITING SHIFTS
  {
    code: PERMISSIONS.VISITING_SHIFTS.VIEW,
    name: 'Xem ca thăm bệnh',
    description: 'Xem danh sách và chi tiết ca thăm bệnh',
    group: 'Ca thăm bệnh',
  },
  {
    code: PERMISSIONS.VISITING_SHIFTS.CREATE,
    name: 'Tạo ca thăm bệnh',
    description: 'Tạo mới ca thăm bệnh',
    group: 'Ca thăm bệnh',
  },
  {
    code: PERMISSIONS.VISITING_SHIFTS.UPDATE,
    name: 'Cập nhật ca thăm bệnh',
    description: 'Chỉnh sửa thông tin ca thăm bệnh',
    group: 'Ca thăm bệnh',
  },
  {
    code: PERMISSIONS.VISITING_SHIFTS.DELETE,
    name: 'Xóa ca thăm bệnh',
    description: 'Xóa ca thăm bệnh khỏi hệ thống',
    group: 'Ca thăm bệnh',
  },
]
