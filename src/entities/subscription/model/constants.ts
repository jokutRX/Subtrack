import type { BillingCycle } from './types'

export const CATEGORIES = [
  'Кинотеатры',
  'Музыка',
  'Игры',
  'Облачные хранилища',
  'VPN',
  'Образование',
  'Работа и продуктивность',
  'Спорт и здоровье',
] as const

export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  weekly: 'Еженедельно',
  monthly: 'Ежемесячно',
  yearly: 'Ежегодно',
}

const CATEGORY_STYLES: Record<string, string> = {
  Кинотеатры: 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
  Музыка: 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400',
  Игры: 'border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400',
  'Облачные хранилища': 'border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  VPN: 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Образование: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'Работа и продуктивность': 'border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400',
  'Спорт и здоровье': 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}

const DEFAULT_CATEGORY_STYLE =
  'border-border bg-muted text-muted-foreground'

export function getCategoryStyle(category: string): string {
  return CATEGORY_STYLES[category] ?? DEFAULT_CATEGORY_STYLE
}