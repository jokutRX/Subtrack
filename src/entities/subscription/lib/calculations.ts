import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  format,
  parseISO,
  startOfMonth,
} from 'date-fns'
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
  return list.filter(
    (s) => s.status === 'active' && getDaysUntilBilling(s) <= days,
  )
}

export function getMonthlyForecast(
  list: Subscription[],
  months = 6,
): { label: string; total: number }[] {
  const now = new Date()
  const buckets = Array.from({ length: months }, (_, i) => {
    const d = addMonths(startOfMonth(now), i)
    return {
      key: format(d, 'yyyy-MM'),
      label: format(d, 'LLL', { locale: ru }),
      total: 0,
    }
  })
  const horizonEnd = addMonths(startOfMonth(now), months)

  for (const s of list.filter((x) => x.status === 'active')) {
    let date = parseISO(s.nextBillingAt)
    while (date < horizonEnd) {
      const key = format(startOfMonth(date), 'yyyy-MM')
      const bucket = buckets.find((b) => b.key === key)
      if (bucket) bucket.total += s.price
      date =
        s.billingCycle === 'monthly'
          ? addMonths(date, 1)
          : s.billingCycle === 'yearly'
            ? addMonths(date, 12)
            : addDays(date, 7)
    }
  }

  return buckets
}

export function getWeekForecast(
  list: Subscription[],
): { label: string; total: number }[] {
  const now = new Date()
  const days = Array.from({ length: 7 }, (_, i) => ({
    label: i === 0 ? 'Сегодня' : format(addDays(now, i), 'dd.MM'),
    total: 0,
  }))

  for (const s of list.filter((x) => x.status === 'active')) {
    const d = getDaysUntilBilling(s)
    if (d >= 0 && d < 7) days[d].total += s.price
  }

  return days
}

export function getSubscriptionsGrowth(
  list: Subscription[],
  months = 6,
): { label: string; total: number }[] {
  const now = new Date()
  return Array.from({ length: months }, (_, i) => {
    const monthStart = addMonths(startOfMonth(now), i - (months - 1))
    const monthEnd = addMonths(monthStart, 1)
    const count = list.filter((s) => parseISO(s.createdAt) < monthEnd).length
    return {
      label: format(monthStart, 'LLL', { locale: ru }),
      total: count,
    }
  })
}