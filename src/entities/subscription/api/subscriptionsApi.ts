import { apiCall } from '@/shared/api/client'
import type { Subscription } from '../model/types'

const KEY = 'subtrack_subscriptions'

const seed: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    category: 'Entertainment',
    price: 799,
    currency: 'RUB',
    billingCycle: 'monthly',
    nextBillingAt: '2026-08-20',
    status: 'active',
    createdAt: '2026-01-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'iCloud',
    category: 'Cloud',
    price: 149,
    currency: 'RUB',
    billingCycle: 'monthly',
    nextBillingAt: '2026-08-16',
    status: 'active',
    createdAt: '2026-01-01T10:00:00Z',
  },
]

function read(): Subscription[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed))
    return seed
  }
  return JSON.parse(raw)
}

function write(list: Subscription[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export const subscriptionsApi = {
  list: () => apiCall(async () => read()),
  
  create: (data: Omit<Subscription, 'id' | 'createdAt'>) =>
    apiCall(async () => {
      const item: Subscription = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      write([item, ...read()])
      return item
    }),
  
  update: (id: string, data: Partial<Subscription>) =>
    apiCall(async () => {
      const list = read().map((s) => (s.id === id ? { ...s, ...data } : s))
      write(list)
      return list.find((s) => s.id === id)!
    }),
  
  remove: (id: string) =>
    apiCall(async () => {
      write(read().filter((s) => s.id !== id))
    }),
}