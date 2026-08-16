import { formatCurrency } from '@/shared/lib/format'
import {
  formatBillingDate,
  getDaysUntilBilling,
  getMonthlyCost,
  getTotalMonthlyCost,
  getUpcoming,
} from '@/entities/subscription/lib/calculations'
import type { Subscription } from '@/entities/subscription/model/types'

export interface AnswerItem {
  title: string
  subtitle?: string
  value: string
}

export interface AssistantAnswer {
  text: string
  highlight?: string
  items?: AnswerItem[]
}

export const SUGGESTIONS = [
  'Сколько я трачу в месяц?',
  'Какая подписка самая дорогая?',
  'Что спишется на этой неделе?',
  'Сколько уходит на кино?',
  'На чём можно сэкономить?',
]

const CATEGORY_SYNONYMS: Record<string, string[]> = {
  Кинотеатры: ['кино', 'фильм', 'сериал', 'кинотеатр', 'смотрю'],
  Музыка: ['музык', 'песн', 'слуша', 'спотифай'],
  Игры: ['игр', 'гейм', 'playstation', 'ps plus'],
  'Облачные хранилища': ['облак', 'icloud', 'хранилищ', 'фотк'],
  VPN: ['vpn', 'впн'],
  Образование: ['учеб', 'образован', 'курс'],
  'Работа и продуктивность': ['работ', 'продуктив', 'gpt', 'notion', 'чат'],
  'Спорт и здоровье': ['спорт', 'здоров', 'зал', 'трен'],
}

export function answerQuery(raw: string, list: Subscription[]): AssistantAnswer {
  const q = raw.toLowerCase()
  const active = list.filter((s) => s.status === 'active')

  const category = Object.entries(CATEGORY_SYNONYMS).find(([, syns]) =>
    syns.some((w) => q.includes(w)),
  )?.[0]

  if (category) {
    const subs = active.filter((s) => s.category === category)
    if (subs.length === 0)
      return { text: `В категории «${category}» активных подписок нет.` }
    const total = subs.reduce((sum, s) => sum + getMonthlyCost(s), 0)
    return {
      text: `На «${category.toLowerCase()}» уходит ${formatCurrency(total, 'RUB')} в месяц:`,
      highlight: `${formatCurrency(total, 'RUB')}/мес`,
      items: subs.map((s) => ({
        title: s.name,
        subtitle: `списание ${formatBillingDate(s.nextBillingAt)}`,
        value: `${formatCurrency(getMonthlyCost(s), 'RUB')}/мес`,
      })),
    }
  }

  if (/(недел|ближай|следующ|скоро)/.test(q)) {
    const upcoming = getUpcoming(list).sort(
      (a, b) => getDaysUntilBilling(a) - getDaysUntilBilling(b),
    )
    if (upcoming.length === 0)
      return { text: 'На ближайшую неделю списаний нет — можно выдохнуть.' }
    const total = upcoming.reduce((sum, s) => sum + s.price, 0)
    return {
      text: 'На этой неделе спишется:',
      highlight: formatCurrency(total, 'RUB'),
      items: upcoming.map((s) => {
        const d = getDaysUntilBilling(s)
        return {
          title: s.name,
          subtitle: d === 0 ? 'сегодня' : d === 1 ? 'завтра' : `через ${d} дн.`,
          value: formatCurrency(s.price, s.currency),
        }
      }),
    }
  }

  if (/(дорог|максималь|больше всего)/.test(q)) {
    const top = [...active].sort(
      (a, b) => getMonthlyCost(b) - getMonthlyCost(a),
    )[0]
    if (!top) return { text: 'Активных подписок пока нет.' }
    return {
      text: `Самая дорогая — «${top.name}» (${top.category.toLowerCase()}).`,
      highlight: `${formatCurrency(getMonthlyCost(top), 'RUB')}/мес`,
    }
  }

  if (/дешев/.test(q)) {
    const min = [...active].sort(
      (a, b) => getMonthlyCost(a) - getMonthlyCost(b),
    )[0]
    if (!min) return { text: 'Активных подписок пока нет.' }
    return {
      text: `Самая дешёвая — «${min.name}».`,
      highlight: `${formatCurrency(getMonthlyCost(min), 'RUB')}/мес`,
    }
  }

  if (/сколько.*подписок|подписок у меня/.test(q)) {
    return {
      text: `Активных — ${active.length}, в архиве — ${list.length - active.length}.`,
      highlight: String(active.length),
    }
  }

  if (/(сэконом|сократ|отмен|урез|лишн)/.test(q)) {
    const top2 = [...active]
      .sort((a, b) => getMonthlyCost(b) - getMonthlyCost(a))
      .slice(0, 2)
    if (top2.length === 0) return { text: 'Активных подписок пока нет.' }
    const save = top2.reduce((sum, s) => sum + getMonthlyCost(s), 0)
    return {
      text: `Если отключить две самые дорогие, сэкономишь ${formatCurrency(save, 'RUB')}/мес:`,
      highlight: `${formatCurrency(save, 'RUB')}/мес`,
      items: top2.map((s) => ({
        title: s.name,
        subtitle: s.category,
        value: `${formatCurrency(getMonthlyCost(s), 'RUB')}/мес`,
      })),
    }
  }

  if (/(трачу|плачу|расход|уходит|в месяц)/.test(q)) {
    const total = getTotalMonthlyCost(list)
    return {
      text: `Это ~${formatCurrency(Math.round(total / 30), 'RUB')} в день.`,
      highlight: `${formatCurrency(total, 'RUB')}/мес`,
    }
  }

  return {
    text: 'Пока понимаю такие вопросы — ткни в подсказку ниже или спроси похоже.',
  }
}