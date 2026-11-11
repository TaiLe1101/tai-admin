import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type Messaging,
  type MessagePayload,
} from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Khởi tạo Firebase App nếu chưa có
export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

/**
 * Lấy instance Messaging nếu trình duyệt hỗ trợ
 */
export async function getFirebaseMessaging(): Promise<Messaging | null> {
  try {
    const supported = await isSupported()
    if (!supported) return null
    return getMessaging(firebaseApp)
  } catch (error) {
    console.warn('Lỗi khởi tạo Firebase Messaging:', error)
    return null
  }
}

/**
 * Yêu cầu quyền và lấy FCM Device Token từ Firebase
 */
export async function requestFcmToken(): Promise<string | null> {
  try {
    if (typeof window === 'undefined') return null

    if (!('Notification' in window)) {
      console.warn('Trình duyệt không hỗ trợ Web Notification')
      return null
    }

    let permission = Notification.permission
    if (permission === 'default') {
      permission = await Notification.requestPermission()
    }

    if (permission !== 'granted') {
      console.warn('Quyền thông báo chưa được người dùng cấp phép')
      return null
    }

    const messaging = await getFirebaseMessaging()
    if (!messaging) {
      console.warn('Firebase Messaging không hỗ trợ trên trình duyệt này')
      return null
    }

    let serviceWorkerRegistration: ServiceWorkerRegistration | undefined
    if ('serviceWorker' in navigator) {
      try {
        const swUrl = new URL(
          '/firebase-messaging-sw.js',
          window.location.origin,
        )
        if (firebaseConfig.apiKey)
          swUrl.searchParams.set('apiKey', firebaseConfig.apiKey)
        if (firebaseConfig.authDomain)
          swUrl.searchParams.set('authDomain', firebaseConfig.authDomain)
        if (firebaseConfig.projectId)
          swUrl.searchParams.set('projectId', firebaseConfig.projectId)
        if (firebaseConfig.storageBucket)
          swUrl.searchParams.set('storageBucket', firebaseConfig.storageBucket)
        if (firebaseConfig.messagingSenderId)
          swUrl.searchParams.set(
            'messagingSenderId',
            firebaseConfig.messagingSenderId,
          )
        if (firebaseConfig.appId)
          swUrl.searchParams.set('appId', firebaseConfig.appId)

        serviceWorkerRegistration = await navigator.serviceWorker.register(
          swUrl.toString(),
        )
      } catch (swErr) {
        console.warn('Không thể đăng ký service worker firebase:', swErr)
      }
    }

    const rawVapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
    const isValidVapidKey =
      typeof rawVapidKey === 'string' &&
      !rawVapidKey.startsWith('G-') &&
      rawVapidKey.trim().length > 30

    if (rawVapidKey && !isValidVapidKey) {
      console.warn(
        `[FCM] VITE_FIREBASE_VAPID_KEY="${rawVapidKey}" không phải VAPID Web Push key hợp lệ (đây là mã Google Analytics). Hệ thống sẽ bỏ qua tham số này.`,
      )
    }

    const token = await getToken(messaging, {
      ...(isValidVapidKey ? { vapidKey: rawVapidKey.trim() } : {}),
      serviceWorkerRegistration,
    })

    if (token) {
      console.info('[FCM] Đã lấy thành công FCM Token:', token)
    }

    return token || null
  } catch (error) {
    console.warn('[FCM] Không thể lấy FCM Token từ Firebase:', error)
    return null
  }
}

/**
 * Đăng ký lắng nghe thông báo khi ứng dụng đang mở (Foreground)
 */
export async function registerForegroundPushListener(
  callback: (payload: MessagePayload) => void,
): Promise<(() => void) | null> {
  const messaging = await getFirebaseMessaging()
  if (!messaging) return null

  return onMessage(messaging, (payload) => {
    callback(payload)
  })
}
