import {
  ArrowRight,
  CalendarClock,
  CreditCard,
  Tag,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { isThisMonth, parseISO } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSubscriptions } from '@/features/subscriptions/hooks/useSubscriptions'
import { formatCurrency } from '@/shared/lib/format'
import {
  formatBillingDate,
  getDaysUntilBilling,
  getTotalMonthlyCost,
  getUpcoming,
} from '@/entities/subscription/lib/calculations'

export function StatsCards() {
  const { data } = useSubscriptions()
  const list = data ?? []
  const active = list.filter((s) => s.status === 'active')
  const archived = list.length - active.length

  const monthlyTotal = getTotalMonthlyCost(list)
  const perDay = Math.round(monthlyTotal / 30)
  const avgCheck = active.length
    ? Math.round(monthlyTotal / active.length)
    : 0

  const addedThisMonth = active.filter((s) =>
    isThisMonth(parseISO(s.createdAt)),
  ).length

  const categoryCount = new Map<string, number>()
  for (const s of active) {
    categoryCount.set(s.category, (categoryCount.get(s.category) ?? 0) + 1)
  }
  const topCategory = [...categoryCount.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0]

  const upcoming = getUpcoming(list).sort(
    (a, b) => getDaysUntilBilling(a) - getDaysUntilBilling(b),
  )
  const upcomingTotal = upcoming.reduce((sum, s) => sum + s.price, 0)
  const nearest = upcoming[0]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Расходы в месяц */}
      <Card>
        <CardContent className="px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Расходы в месяц</p>
            <Badge
              variant="outline"
              className="gap-1 rounded-full font-normal text-muted-foreground"
            >
              <Wallet size={12} /> ≈ {perDay} ₽/день
            </Badge>
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
            {formatCurrency(monthlyTotal, 'RUB')}
          </p>
          <div className="mt-4 space-y-1">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <CreditCard size={14} /> {active.length} активных подписок
            </p>
            <p className="text-sm text-muted-foreground">
              Средний чек {formatCurrency(avgCheck, 'RUB')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Активные подписки */}
      <Card>
        <CardContent className="px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Активные подписки</p>
            {addedThisMonth > 0 ? (
              <Badge className="gap-1 rounded-full border-transparent bg-green-500/10 font-normal text-green-600 dark:text-green-400">
                <TrendingUp size={12} /> +{addedThisMonth} за месяц
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="rounded-full font-normal text-muted-foreground"
              >
                без новых
              </Badge>
            )}
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
            {active.length}
          </p>
          <div className="mt-4 space-y-1">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Tag size={14} />
              {topCategory ? `Топ: ${topCategory}` : 'Пока нет подписок'}
            </p>
            <p className="text-sm text-muted-foreground">
              В архиве: {archived}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Списания за 7 дней */}
      <Card>
        <CardContent className="px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Списания за 7 дней</p>
            <Badge
              variant="outline"
              className={`gap-1 rounded-full font-normal ${
                upcoming.length > 0
                  ? 'border-transparent bg-destructive/10 text-destructive'
                  : 'text-muted-foreground'
              }`}
            >
              <CalendarClock size={12} /> {upcoming.length} списаний
            </Badge>
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
            {formatCurrency(upcomingTotal, 'RUB')}
          </p>
          <div className="mt-4 space-y-1">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <ArrowRight size={14} />
              {nearest ? `Ближайшее: ${nearest.name}` : 'Нет ближайших списаний'}
            </p>
            <p className="text-sm text-muted-foreground">
              {nearest ? formatBillingDate(nearest.nextBillingAt) : 'Все списания дальше недели'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}