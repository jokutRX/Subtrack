import { describe, expect, it } from 'vitest'
import type { UIMessage, UIMessageChunk } from 'ai'
import { addDays } from 'date-fns'
import { LocalIntentTransport } from '../localTransport'
import type { Subscription } from '@/entities/subscription/model/types'

const list: Subscription[] = [
  {
    id: '1',
    name: 'Кинопоиск',
    category: 'Кинотеатры',
    price: 349,
    currency: 'RUB',
    billingCycle: 'monthly',
    nextBillingAt: addDays(new Date(), 2).toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
  },
]

describe('LocalIntentTransport', () => {
  it('стримит ответ по протоколу AI SDK', async () => {
    const transport = new LocalIntentTransport(() => list)
    const messages: UIMessage[] = [
      {
        id: 'm1',
        role: 'user',
        parts: [{ type: 'text', text: 'Сколько я трачу в месяц?' }],
      },
    ]

    const stream = await transport.sendMessages({
      trigger: 'submit-message',
      chatId: 'test',
      messageId: undefined,
      messages,
      abortSignal: undefined,
    })

    const chunks: UIMessageChunk[] = []
    const reader = stream.getReader()
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    expect(chunks[0].type).toBe('start')
    expect(chunks[chunks.length - 1].type).toBe('finish')
    const deltas = chunks.filter((c) => c.type === 'text-delta')
    expect(deltas.length).toBeGreaterThan(0)
    const full = deltas
      .map((c) => (c.type === 'text-delta' ? c.delta : ''))
      .join('')
    expect(full).toContain('/мес')
  })
})