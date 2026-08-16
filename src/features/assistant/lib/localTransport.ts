import type { ChatTransport, UIMessage, UIMessageChunk } from 'ai'
import type { Subscription } from '@/entities/subscription/model/types'
import { answerQuery } from './intents'
import { formatAnswer } from './formatAnswer'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

interface SendOptions {
  trigger: 'submit-message' | 'regenerate-message'
  chatId: string
  messageId: string | undefined
  messages: UIMessage[]
  abortSignal: AbortSignal | undefined
}

export class LocalIntentTransport implements ChatTransport<UIMessage> {
  private readonly getSubscriptions: () => Subscription[]

  constructor(getSubscriptions: () => Subscription[]) {
    this.getSubscriptions = getSubscriptions
  }

  async sendMessages({ messages, abortSignal }: SendOptions) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    const question = (lastUser?.parts ?? [])
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join(' ')

    const answer = formatAnswer(
      answerQuery(question, this.getSubscriptions()),
    )
    const tokens = answer.match(/\S+\s*/g) ?? [answer]

    return new ReadableStream<UIMessageChunk>({
      async start(controller) {
        controller.enqueue({ type: 'start' })
        controller.enqueue({ type: 'start-step' })
        controller.enqueue({ type: 'text-start', id: 'local' })

        for (const token of tokens) {
          if (abortSignal?.aborted) break
          controller.enqueue({ type: 'text-delta', id: 'local', delta: token })
          await sleep(18)
        }

        controller.enqueue({ type: 'text-end', id: 'local' })
        controller.enqueue({ type: 'finish-step' })
        controller.enqueue({ type: 'finish' })
        controller.close()
      },
    })
  }

  async reconnectToStream(): Promise<ReadableStream<UIMessageChunk> | null> {
    return null
  }
}