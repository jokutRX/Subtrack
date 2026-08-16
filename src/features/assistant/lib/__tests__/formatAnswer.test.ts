import { describe, expect, it } from 'vitest'
import { formatAnswer } from '../formatAnswer'

describe('formatAnswer', () => {
  it('собирает текст, итог и список', () => {
    const text = formatAnswer({
      text: 'На «кинотеатры» уходит 1 148 ₽ в месяц:',
      highlight: '1 148 ₽/мес',
      items: [{ title: 'Netflix', subtitle: 'списание завтра', value: '799 ₽/мес' }],
    })
    expect(text).toContain('Итого: 1 148 ₽/мес')
    expect(text).toContain('• Netflix — списание завтра: 799 ₽/мес')
  })

  it('работает без items и highlight', () => {
    expect(formatAnswer({ text: 'Привет' })).toBe('Привет')
  })
})