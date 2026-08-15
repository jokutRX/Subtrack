export type BillingCycle = 'weekly' | 'monthly' | 'yearly'
export type SubscriptionStatus = 'active' | 'archived'

export interface Subscription {
  id: string
  name: string
  category: string
  price: number
  currency: 'RUB' | 'USD' | 'EUR'
  billingCycle: BillingCycle
  nextBillingAt: string
  status: SubscriptionStatus
  note?: string
  createdAt: string
}