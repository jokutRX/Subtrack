import { describe, expect, it } from 'vitest'
import { addDays } from 'date-fns'
import {
  formatBillingDate,
  getDaysUntilBilling,
  getMonthlyCost,
  getTotalMonthlyCost,
  getUpcoming,
  getWeekForecast,
} from '../calculations'
import type { Subscription } from '../../model/types'

const makeSub = (over: Partial<Subscription> = {}): Subscription => ({
  id: '1',
  name: 'Тест',
  category: 'Кинотеатры',
  price: 300,
  currency: 'RUB',
  billingCycle: 'monthly',
  nextBillingAt: addDays(new Date(), 3).toISOString(),
  status: 'active',
  createdAt: new Date().toISOString(),
  ...over,
})

describe('getMonthlyCost', () => {
  it('monthly возвращает цену как есть', () => {
    expect(getMonthlyCost(makeSub({ billingCycle: 'monthly', price: 300 }))).toBe(300)
  })
  it('yearly делит на 12', () => {
    expect(getMonthlyCost(makeSub({ billingCycle: 'yearly', price: 1200 }))).toBe(100)
  })
  it('weekly умножает на 4.33', () => {
    expect(getMonthlyCost(makeSub({ billingCycle: 'weekly', price: 100 }))).toBe(433)
  })
})

describe('getDaysUntilBilling', () => {
  it('сегодня — 0', () => {
    expect(getDaysUntilBilling(makeSub({ nextBillingAt: new Date().toISOString() }))).toBe(0)
  })
  it('завтра — 1', () => {
    expect(getDaysUntilBilling(makeSub({ nextBillingAt: addDays(new Date(), 1).toISOString() }))).toBe(1)
  })
})

describe('getTotalMonthlyCost', () => {
  it('суммирует только активные', () => {
    const list = [
      makeSub({ id: '1', price: 300 }),
      makeSub({ id: '2', price: 700 }),
      makeSub({ id: '3', price: 999, status: 'archived' }),
    ]
    expect(getTotalMonthlyCost(list)).toBe(1000)
  })
})

describe('getUpcoming', () => {
  it('берёт списания в пределах 7 дней и только активные', () => {
    const list = [
      makeSub({ id: 'soon', nextBillingAt: addDays(new Date(), 2).toISOString() }),
      makeSub({ id: 'far', nextBillingAt: addDays(new Date(), 8).toISOString() }),
      makeSub({ id: 'arch', nextBillingAt: addDays(new Date(), 1).toISOString(), status: 'archived' }),
    ]
    const res = getUpcoming(list)
    expect(res).toHaveLength(1)
    expect(res[0].id).toBe('soon')
  })
})

describe('getWeekForecast', () => {
  it('кладёт платёж в нужный день', () => {
    const list = [makeSub({ price: 500, nextBillingAt: new Date().toISOString() })]
    const days = getWeekForecast(list)
    expect(days).toHaveLength(7)
    expect(days[0].total).toBe(500)
    expect(days[1].total).toBe(0)
  })
})

describe('formatBillingDate', () => {
  it('форматирует как «17 Августа 2026»', () => {
    expect(formatBillingDate('2026-08-17')).toMatch(/^\d{1,2} [А-Я][а-я]+ \d{4}$/)
  })
})