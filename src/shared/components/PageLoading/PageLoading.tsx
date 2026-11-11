export interface PageLoadingProps {
  /** Toàn màn hình (fixed). Mặc định: true */
  fullScreen?: boolean
  /** Dòng chữ thông báo bên dưới ba chấm, ví dụ: 'Đang tải dữ liệu...' */
  tip?: string
  /** Kích thước logo (pixel). Mặc định: 72 */
  logoSize?: number
  /** ClassName tùy biến */
  className?: string
}

export default function PageLoading({
  fullScreen = true,
  tip,
  logoSize = 72,
  className = '',
}: PageLoadingProps) {
  const containerClass = fullScreen
    ? 'fixed inset-0 z-50 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center select-none'
    : 'w-full h-full min-h-[280px] flex flex-col items-center justify-center p-6 select-none'

  return (
    <div className={`${containerClass} ${className}`}>
      {/* Container logo trung tâm vuông vắn, sắc nét */}
      <div className="flex items-center justify-center">
        {/* <img
          src="/images/logo.png"
          alt="EOffice Loading"
          width={logoSize}
          height={logoSize}
          style={{
            width: logoSize,
            height: logoSize,
            aspectRatio: '1 / 1',
            objectFit: 'contain',
            display: 'block',
          }}
        /> */}
      </div>

      {/* Ba chấm loading ở dưới */}
      <div className="flex items-center gap-2 mt-5">
        <span
          className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block"
          style={{
            animation: 'safeCareDotBounce 1.4s ease-in-out infinite both',
            animationDelay: '0ms',
          }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block"
          style={{
            animation: 'safeCareDotBounce 1.4s ease-in-out infinite both',
            animationDelay: '180ms',
          }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block"
          style={{
            animation: 'safeCareDotBounce 1.4s ease-in-out infinite both',
            animationDelay: '360ms',
          }}
        />
      </div>

      {/* Thông điệp gợi ý nếu có */}
      {tip && (
        <p className="text-xs font-medium text-slate-500 mt-3 tracking-wide animate-pulse">
          {tip}
        </p>
      )}
    </div>
  )
}
