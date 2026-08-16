import { makeAutoObservable } from 'mobx'
import { getDaysUntilBilling } from '@/entities/subscription/lib/calculations'
import type { Subscription } from '@/entities/subscription/model/types'

const ENABLED_KEY = 'subtrack_notify_enabled'
const NOTIFIED_KEY = 'subtrack_notified'

class NotificationStore {
  enabled = localStorage.getItem(ENABLED_KEY) === '1'
  supported = typeof window !== 'undefined' && 'Notification' in window

  constructor() {
    makeAutoObservable(this)
  }

  get permission(): NotificationPermission | 'unsupported' {
    return this.supported ? Notification.permission : 'unsupported'
  }

  async enable(): Promise<boolean> {
    if (!this.supported) return false
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      this.enabled = true
      localStorage.setItem(ENABLED_KEY, '1')
      return true
    }
    return false
  }

  disable() {
    this.enabled = false
    localStorage.removeItem(ENABLED_KEY)
  }
}

export const notificationStore = new NotificationStore()

export function notify(title: string, body: string) {
  if (!notificationStore.supported) return
  if (Notification.permission === 'granted') {
    new Notification(title, { body })
  }
}

export function checkBillingReminders(subscriptions: Subscription[]) {
  if (!notificationStore.supported || !notificationStore.enabled) return
  if (Notification.permission !== 'granted') return

  const notified: string[] = JSON.parse(
    localStorage.getItem(NOTIFIED_KEY) ?? '[]',
  )

  for (const s of subscriptions.filter((x) => x.status === 'active')) {
    const days = getDaysUntilBilling(s)
    if (days !== 0 && days !== 1) continue

    const key = `${s.id}:${s.nextBillingAt}`
    if (notified.includes(key)) continue

    notified.push(key)
    notify(
      days === 0 ? `Списание сегодня: ${s.name}` : `Завтра спишется: ${s.name}`,
      `Сумма платежа: ${s.price} ${s.currency === 'RUB' ? '₽' : s.currency}`,
    )
  }

  localStorage.setItem(NOTIFIED_KEY, JSON.stringify(notified))
}