import { addDays, subMonths } from 'date-fns'
import type { Subscription } from '../model/types'

const KEY = 'subtrack_subscriptions'

function buildSeed(): Subscription[] {
  const now = new Date()
  const d = (days: number) => addDays(now, days).toISOString()
  const created = (monthsAgo: number) => subMonths(now, monthsAgo).toISOString()

  return [
    { id: '1', name: 'Кинопоиск', category: 'Кинотеатры', price: 349, currency: 'RUB', billingCycle: 'monthly', nextBillingAt: d(2), status: 'active', createdAt: created(14) },
    { id: '2', name: 'Spotify', category: 'Музыка', price: 299, currency: 'RUB', billingCycle: 'monthly', nextBillingAt: d(5), status: 'active', createdAt: created(20) },
    { id: '3', name: 'iCloud 200 ГБ', category: 'Облачные хранилища', price: 149, currency: 'RUB', billingCycle: 'monthly', nextBillingAt: d(1), status: 'active', createdAt: created(26) },
    { id: '4', name: 'PS Plus', category: 'Игры', price: 5490, currency: 'RUB', billingCycle: 'yearly', nextBillingAt: d(40), status: 'active', createdAt: created(10) },
    { id: '5', name: 'ChatGPT Plus', category: 'Работа и продуктивность', price: 20, currency: 'USD', billingCycle: 'monthly', nextBillingAt: d(6), status: 'active', createdAt: created(8) },
    { id: '6', name: 'VPN Pro', category: 'VPN', price: 350, currency: 'RUB', billingCycle: 'monthly', nextBillingAt: d(3), status: 'active', createdAt: created(5) },
    { id: '7', name: 'Coursera', category: 'Образование', price: 3200, currency: 'RUB', billingCycle: 'yearly', nextBillingAt: d(75), status: 'active', createdAt: created(7) },
    { id: '8', name: 'Netflix', category: 'Кинотеатры', price: 799, currency: 'RUB', billingCycle: 'monthly', nextBillingAt: d(12), status: 'active', createdAt: created(3) },
    { id: '9', name: 'Strava', category: 'Спорт и здоровье', price: 450, currency: 'RUB', billingCycle: 'monthly', nextBillingAt: d(18), status: 'active', createdAt: created(2) },
    { id: '10', name: 'Notion', category: 'Работа и продуктивность', price: 900, currency: 'RUB', billingCycle: 'monthly', nextBillingAt: d(25), status: 'archived', createdAt: created(12) },
  ]
}

function read(): Subscription[] {
  const raw = localStorage.getItem(KEY)
  if (raw) return JSON.parse(raw) as Subscription[]
  const seed = buildSeed()
  localStorage.setItem(KEY, JSON.stringify(seed))
  return seed
}

function write(list: Subscription[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export const subscriptionsApi = {
  list: (): Promise<Subscription[]> => Promise.resolve(read()),

  create: (data: Omit<Subscription, 'id' | 'createdAt'>): Promise<Subscription> => {
    const sub: Subscription = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    write([sub, ...read()])
    return Promise.resolve(sub)
  },

  update: (id: string, data: Partial<Subscription>): Promise<Subscription> => {
    const list = read()
    const idx = list.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error('Subscription not found')
    list[idx] = { ...list[idx], ...data }
    write(list)
    return Promise.resolve(list[idx])
  },

  remove: (id: string): Promise<void> => {
    write(read().filter((s) => s.id !== id))
    return Promise.resolve()
  },

  resetDemo: (): Promise<void> => {
    write(buildSeed())
    return Promise.resolve()
  },
}