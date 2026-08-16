import type { AssistantAnswer } from './intents'

export function formatAnswer(a: AssistantAnswer): string {
  const lines: string[] = [a.text]

  if (a.highlight) {
    lines.push('', `Итого: ${a.highlight}`)
  }

  if (a.items && a.items.length > 0) {
    lines.push('')
    for (const it of a.items) {
      lines.push(
        `• ${it.title}${it.subtitle ? ` — ${it.subtitle}` : ''}: ${it.value}`,
      )
    }
  }

  return lines.join('\n')
}