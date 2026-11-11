export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum AccountType {
  SYSTEM_USER = 'SYSTEM_USER',
  HOSPITAL_EMPLOYEE = 'HOSPITAL_EMPLOYEE',
  PATIENT_VISIT_EMPLOYEE = 'PATIENT_VISIT_EMPLOYEE',
}

export enum LoginStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum CareTaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  CANCELLED = 'CANCELLED',
}

export enum CareAssignmentStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum CaregiverType {
  PROFESSIONAL = 'PROFESSIONAL', // Nuôi bệnh chuyên nghiệp
  PATIENT_HIRED = 'PATIENT_HIRED', // Nuôi bệnh được bệnh nhân thuê
  FAMILY_MEMBER = 'FAMILY_MEMBER', // Nuôi bệnh không chuyên nghiệp (người nhà)
}

export const CAREGIVER_TYPE_LABELS: Record<CaregiverType, string> = {
  [CaregiverType.PROFESSIONAL]: 'Nuôi bệnh chuyên nghiệp',
  [CaregiverType.PATIENT_HIRED]: 'Nuôi bệnh tự do',
  [CaregiverType.FAMILY_MEMBER]: 'Người nhà bệnh nhân',
}

export const CAREGIVER_TYPE_COLORS: Record<CaregiverType, string> = {
  [CaregiverType.PROFESSIONAL]: 'purple',
  [CaregiverType.PATIENT_HIRED]: 'orange',
  [CaregiverType.FAMILY_MEMBER]: 'green',
}

export enum CareTaskType {
  MEAL = 'MEAL', // Đồ ăn
  DRINK = 'DRINK', // Đồ uống
  VITAL_SIGN = 'VITAL_SIGN', // Dấu hiệu sinh tồn
  HYGIENE = 'HYGIENE', // Vệ sinh
  MOVEMENT = 'MOVEMENT', // Vận động
  CHECKUP = 'CHECKUP', // Kiểm tra
  OTHER = 'OTHER', // Khác
}

export enum CarePlanStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum RelationShip {
  FATHER = 'FATHER', // Cha
  MOTHER = 'MOTHER', // Mẹ
  SON = 'SON', // Con trai
  DAUGHTER = 'DAUGHTER', // Con gái
  HUSBAND = 'HUSBAND', // Chồng
  WIFE = 'WIFE', // Vợ
  BROTHER = 'BROTHER', // Anh trai
  YOUNG_BROTHER = 'YOUNG_BROTHER', // Em trai
  SISTER = 'SISTER', // Chị gái
  YOUNG_SISTER = 'YOUNG_SISTER', // Em gái
  OTHER = 'OTHER', // Khác
}

export const RELATIONSHIP_LABELS: Record<RelationShip, string> = {
  [RelationShip.FATHER]: 'Cha',
  [RelationShip.MOTHER]: 'Mẹ',
  [RelationShip.SON]: 'Con trai',
  [RelationShip.DAUGHTER]: 'Con gái',
  [RelationShip.HUSBAND]: 'Chồng',
  [RelationShip.WIFE]: 'Vợ',
  [RelationShip.BROTHER]: 'Anh trai',
  [RelationShip.YOUNG_BROTHER]: 'Em trai',
  [RelationShip.SISTER]: 'Chị gái',
  [RelationShip.YOUNG_SISTER]: 'Em gái',
  [RelationShip.OTHER]: 'Khác',
}

export enum AttendanceStatus {
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
}

export enum DeviceType {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
  WEB = 'WEB',
}

export enum QrScanType {
  DAILY_CARE_CHECK_IN = 'DAILY_CARE_CHECK_IN',
  DAILY_CARE_CHECK_OUT = 'DAILY_CARE_CHECK_OUT',
  VISITATION_CHECK_IN = 'VISITATION_CHECK_IN',
  UNKNOWN = 'UNKNOWN',
}

export enum QrScanStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum PatientVisitationStatus {
  APPROVED = 'APPROVED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export const PATIENT_VISITATION_STATUS_LABELS: Record<PatientVisitationStatus, string> = {
  [PatientVisitationStatus.APPROVED]: 'Đã duyệt',
  [PatientVisitationStatus.CHECKED_IN]: 'Đang thăm',
  [PatientVisitationStatus.CHECKED_OUT]: 'Đã ra về',
  [PatientVisitationStatus.CANCELLED]: 'Đã hủy',
  [PatientVisitationStatus.EXPIRED]: 'Hết hạn',
}

export const PATIENT_VISITATION_STATUS_COLORS: Record<PatientVisitationStatus, string> = {
  [PatientVisitationStatus.APPROVED]: 'blue',
  [PatientVisitationStatus.CHECKED_IN]: 'green',
  [PatientVisitationStatus.CHECKED_OUT]: 'purple',
  [PatientVisitationStatus.CANCELLED]: 'red',
  [PatientVisitationStatus.EXPIRED]: 'default',
}

export enum VisitationCancellationReasonType {
  VISITOR_REQUEST = 'VISITOR_REQUEST',
  PATIENT_REQUEST = 'PATIENT_REQUEST',
  DOCTOR_ORDER = 'DOCTOR_ORDER',
  OVER_CAPACITY = 'OVER_CAPACITY',
  OUT_OF_HOURS = 'OUT_OF_HOURS',
  OTHER = 'OTHER',
}

export const VISITATION_CANCELLATION_REASON_LABELS: Record<VisitationCancellationReasonType, string> = {
  [VisitationCancellationReasonType.VISITOR_REQUEST]: 'Người thăm bận / chủ động hủy',
  [VisitationCancellationReasonType.PATIENT_REQUEST]: 'Bệnh nhân yêu cầu hủy / mệt',
  [VisitationCancellationReasonType.DOCTOR_ORDER]: 'Bác sĩ chỉ định hạn chế thăm',
  [VisitationCancellationReasonType.OVER_CAPACITY]: 'Quá tải số lượng',
  [VisitationCancellationReasonType.OUT_OF_HOURS]: 'Ngoài giờ thăm',
  [VisitationCancellationReasonType.OTHER]: 'Lý do khác',
}

export enum BedStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  RESERVED = 'RESERVED',
}

export const BED_STATUS_LABELS: Record<BedStatus, string> = {
  [BedStatus.AVAILABLE]: 'Giường trống',
  [BedStatus.OCCUPIED]: 'Đang sử dụng',
  [BedStatus.MAINTENANCE]: 'Bảo trì',
  [BedStatus.RESERVED]: 'Đã đặt trước',
}

export const BED_STATUS_COLORS: Record<BedStatus, string> = {
  [BedStatus.AVAILABLE]: 'success',
  [BedStatus.OCCUPIED]: 'blue',
  [BedStatus.MAINTENANCE]: 'warning',
  [BedStatus.RESERVED]: 'purple',
}

