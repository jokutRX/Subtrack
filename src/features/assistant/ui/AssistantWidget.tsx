import { useMemo, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { useQueryClient } from '@tanstack/react-query'
import type { UIMessage } from 'ai'
import { Bot, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/components/ui/message-scroller'
import type { Subscription } from '@/entities/subscription/model/types'
import { SUGGESTIONS } from '../lib/intents'
import { LocalIntentTransport } from '../lib/localTransport'

function MessageBubble({ message }: { message: UIMessage }) {
  const text = message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
  const isUser = message.role === 'user'

  return (
    <div
      className={
        isUser
          ? 'ml-auto w-fit max-w-[80%] whitespace-pre-line rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground'
          : 'mr-auto w-fit max-w-[85%] whitespace-pre-line rounded-2xl bg-muted px-3 py-2 text-sm'
      }
    >
      {text}
    </div>
  )
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const queryClient = useQueryClient()

  const transport = useMemo(
    () =>
      new LocalIntentTransport(
        () =>
          queryClient.getQueryData<Subscription[]>(['subscriptions']) ?? [],
      ),
    [queryClient],
  )

  const { messages, sendMessage, status } = useChat({
    transport,
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: 'Привет! Я ассистент SubTrack. Спроси про свои подписки — отвечу цифрами.',
          },
        ],
      },
    ],
  })

  const isBusy = status === 'submitted' || status === 'streaming'

  const submit = (text: string) => {
    const t = text.trim()
    if (!t || isBusy) return
    sendMessage({ text: t })
    setInput('')
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[520px] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-xl border bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot size={14} />
              </div>
              <div>
                <p className="text-sm font-medium">Ассистент SubTrack</p>
                <p className="text-xs text-muted-foreground">
                  локальный AI-движок, без LLM
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X size={16} />
            </Button>
          </div>

          <MessageScrollerProvider>
            <div className="flex-1 overflow-hidden">
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent className="space-y-3 p-3">
                    {messages.map((m) => (
                      <MessageBubble key={m.id} message={m} />
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </div>
          </MessageScrollerProvider>

          <div className="border-t p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => submit(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                submit(input)
              }}
            >
              <Input
                placeholder="Спроси про подписки…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isBusy}>
                <Send size={14} />
              </Button>
            </form>
          </div>
        </div>
      )}

      <button
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
        onClick={() => setOpen(!open)}
        aria-label="Ассистент"
      >
        <Bot size={20} />
      </button>
    </>
  )
}