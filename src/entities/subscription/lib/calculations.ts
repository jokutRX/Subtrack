import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { Subscription } from '../model/types'

export function getMonthlyCost(s: Subscription): number {
  switch (s.billingCycle) {
    case 'monthly':
      return s.price
    case 'yearly':
      return Math.round(s.price / 12)
    case 'weekly':
      return Math.round(s.price * 4.33)
  }
}

export function getDaysUntilBilling(s: Subscription): number {
  return differenceInCalendarDays(parseISO(s.nextBillingAt), new Date())
}

export function formatBillingDate(iso: string): string {
  const formatted = format(parseISO(iso), 'd MMMM yyyy', { locale: ru })
  const [day, month, year] = formatted.split(' ')
  return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`
}

export function getTotalMonthlyCost(list: Subscription[]): number {
  return list
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + getMonthlyCost(s), 0)
}

export function getUpcoming(list: Subscription[], days = 7): Subscription[] {
  return list.filter((s) => s.status === 'active' && getDaysUntilBilling(s) <= days)
}