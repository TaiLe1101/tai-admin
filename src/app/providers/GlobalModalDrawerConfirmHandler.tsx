import { ExclamationCircleOutlined } from '@ant-design/icons'
import { App } from 'antd'
import { useEffect, useRef } from 'react'

export function GlobalModalDrawerConfirmHandler() {
  const { modal } = App.useApp()
  const isConfirmingRef = useRef(false)

  useEffect(() => {
    const handleCaptureClick = (e: MouseEvent) => {
      // 1. Nếu đang hiển thị modal xác nhận thì bỏ qua
      if (isConfirmingRef.current) return

      const target = e.target as HTMLElement | null
      if (!target) return

      // 2. Bỏ qua các click bên trong popup (Select, DatePicker, Dropdown, Popover, Tooltip,...)
      if (
        target.closest(
          '.ant-select-dropdown, .ant-picker-dropdown, .ant-dropdown, .ant-tooltip, .ant-popover, .ant-cascader-dropdown, .ant-tour, .ant-color-picker-dropdown, .ant-message, .ant-notification',
        )
      ) {
        return
      }

      // 3. Bỏ qua nếu click bên trong hộp thoại confirm của Antd
      if (
        target.closest('.ant-modal-confirm') ||
        document.querySelector('.ant-modal-confirm')
      ) {
        return
      }

      // 4. Kiểm tra click vào vùng ngoài Modal (vùng mask / wrap)
      const modalWrap = target.closest<HTMLElement>('.ant-modal-wrap')
      const isModalContent = target.closest('.ant-modal')

      if (modalWrap && !isModalContent) {
        // Bỏ qua nếu đây là Modal confirm của Antd
        if (modalWrap.querySelector('.ant-modal-confirm')) {
          return
        }

        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()

        isConfirmingRef.current = true
        modal.confirm({
          title: 'Xác nhận',
          icon: <ExclamationCircleOutlined className="text-amber-500" />,
          content: 'Bạn đang có dữ liệu bạn muốn thoát chứ ?',
          okText: 'Xác nhận đóng',
          cancelText: 'Tiếp tục nhập',
          centered: true,
          autoFocusButton: 'cancel',
          okButtonProps: { danger: true },
          cancelButtonProps: { type: 'primary' },
          onOk() {
            isConfirmingRef.current = false
            const closeBtn =
              modalWrap.querySelector<HTMLElement>('.ant-modal-close') ||
              modalWrap.querySelector<HTMLElement>(
                '.ant-modal-footer button:not(.ant-btn-primary)',
              ) ||
              modalWrap.querySelector<HTMLElement>('.ant-modal-footer button')
            if (closeBtn) {
              closeBtn.click()
            }
          },
          onCancel() {
            isConfirmingRef.current = false
          },
        })
        return
      }

      // 5. Kiểm tra click vào vùng ngoài Drawer (vùng mask)
      const isDrawerMask =
        target.classList.contains('ant-drawer-mask') ||
        Boolean(target.closest('.ant-drawer-mask'))
      const drawerRoot = target.closest<HTMLElement>('.ant-drawer')
      const isDrawerContent = target.closest('.ant-drawer-content-wrapper')

      if (isDrawerMask || (drawerRoot && !isDrawerContent)) {
        const activeDrawer =
          drawerRoot || target.closest<HTMLElement>('.ant-drawer')
        if (!activeDrawer) return

        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()

        isConfirmingRef.current = true
        modal.confirm({
          title: 'Xác nhận',
          icon: <ExclamationCircleOutlined className="text-amber-500" />,
          content: 'Bạn đang có dữ liệu bạn muốn thoát chứ ?',
          okText: 'Xác nhận đóng',
          cancelText: 'Tiếp tục nhập',
          centered: true,
          autoFocusButton: 'cancel',
          okButtonProps: { danger: true },
          cancelButtonProps: { type: 'primary' },
          onOk() {
            isConfirmingRef.current = false
            const drawerCloseBtn =
              activeDrawer.querySelector<HTMLElement>('.ant-drawer-close') ||
              activeDrawer.querySelector<HTMLElement>(
                '.ant-drawer-footer button:not(.ant-btn-primary)',
              )
            if (drawerCloseBtn) {
              drawerCloseBtn.click()
            }
          },
          onCancel() {
            isConfirmingRef.current = false
          },
        })
      }
    }

    window.addEventListener('click', handleCaptureClick, true)
    return () => {
      window.removeEventListener('click', handleCaptureClick, true)
    }
  }, [modal])

  return null
}
