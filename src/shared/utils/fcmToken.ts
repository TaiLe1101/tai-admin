const FCM_TOKEN_KEY = 'safecare_fcm_token'

export function getFcmToken(): string | null {
  try {
    return localStorage.getItem(FCM_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setFcmToken(token: string): void {
  try {
    localStorage.setItem(FCM_TOKEN_KEY, token)
  } catch {
    // ignore
  }
}

export function removeFcmToken(): void {
  try {
    localStorage.removeItem(FCM_TOKEN_KEY)
  } catch {
    // ignore
  }
}
