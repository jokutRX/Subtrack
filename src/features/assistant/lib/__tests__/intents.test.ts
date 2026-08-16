import { describe, expect, it } from 'vitest'
import { addDays } from 'date-fns'
import { answerQuery } from '../intents'
import type { Subscription } from '@/entities/subscription/model/types'

const makeSub = (over: Partial<Subscription> = {}): Subscription => ({
  id: '1',
  name: 'Кинопоиск',
  category: 'Кинотеатры',
  price: 349,
  currency: 'RUB',
  billingCycle: 'monthly',
  nextBillingAt: addDays(new Date(), 2).toISOString(),
  status: 'active',
  createdAt: new Date().toISOString(),
  ...over,
})

const list = [
  makeSub({ id: '1', name: 'Кинопоиск', price: 349 }),
  makeSub({ id: '2', name: 'Netflix', category: 'Кинотеатры', price: 799 }),
  makeSub({ id: '3', name: 'Spotify', category: 'Музыка', price: 299 }),
]

describe('answerQuery', () => {
  it('распознаёт категорию', () => {
    const a = answerQuery('Сколько уходит на кино?', list)
    expect(a.text).toContain('кинотеатры')
    expect(a.items).toHaveLength(2)
  })

  it('находит самую дорогую', () => {
    const a = answerQuery('Какая подписка самая дорогая?', list)
    expect(a.text).toContain('Netflix')
  })

  it('показывает списания недели', () => {
    const a = answerQuery('Что спишется на этой неделе?', list)
    expect(a.items?.map((i) => i.title)).toContain('Кинопоиск')
  })

  it('считает количество подписок', () => {
    const a = answerQuery('Сколько у меня подписок?', list)
    expect(a.highlight).toBe('3')
  })

  it('предлагает экономию на двух самых дорогих', () => {
    const a = answerQuery('На чём можно сэкономить?', list)
    expect(a.items).toHaveLength(2)
  })

  it('отвечает про общие траты', () => {
    const a = answerQuery('Сколько я трачу в месяц?', list)
    expect(a.highlight).toContain('/мес')
  })

  it('фолбэк на непонятный вопрос', () => {
    const a = answerQuery('бла бла бла', list)
    expect(a.text).toContain('Пока понимаю')
  })
})