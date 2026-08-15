import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import {
  ArrowRight,
  CalendarClock,
  CreditCard,
  Pencil,
  Tag,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { isThisMonth, parseISO } from 'date-fns'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSubscriptions } from '@/features/subscriptions/hooks/useSubscriptions'
import { formatCurrency } from '@/shared/lib/format'
import { budgetStore } from '@/features/budget/model/budgetStore'
import { BudgetLimitDialog } from '@/features/budget/ui/BudgetLimitDialog'
import {
  formatBillingDate,
  getDaysUntilBilling,
  getMonthlyForecast,
  getSubscriptionsGrowth,
  getTotalMonthlyCost,
  getUpcoming,
  getWeekForecast,
} from '@/entities/subscription/lib/calculations'

const rubTick = (v: number) => (v >= 1000 ? `${Math.round(v / 1000)}к` : String(v))
const countTick = (v: number) => String(Math.round(v))

function MiniAreaChart({
  data,
  formatTick,
}: {
  data: { label: string; total: number }[]
  formatTick: (v: number) => string
}) {
  return (
    <div className="mt-4 h-24 text-muted-foreground">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="cardAreaBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="currentColor"
            strokeOpacity={0.15}
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            interval={0}
            dy={4}
            tick={{ fill: 'currentColor', fontSize: 9 }}
          />
          <YAxis
            orientation="right"
            axisLine={false}
            tickLine={false}
            width={34}
            tick={{ fill: 'currentColor', fontSize: 9 }}
            tickFormatter={formatTick}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#cardAreaBlue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export const StatsCards = observer(() => {
  const [budgetOpen, setBudgetOpen] = useState(false)
  const { data } = useSubscriptions()
  const list = data ?? []
  const active = list.filter((s) => s.status === 'active')
  const archived = list.length - active.length

  const monthlyTotal = getTotalMonthlyCost(list)
  const perDay = Math.round(monthlyTotal / 30)
  const avgCheck = active.length
    ? Math.round(monthlyTotal / active.length)
    : 0

  const limit = budgetStore.limit
  const percent = limit ? Math.round((monthlyTotal / limit) * 100) : 0
  const over = limit !== null && monthlyTotal > limit
  const barColor = over
    ? 'bg-destructive'
    : percent >= 80
      ? 'bg-amber-500'
      : 'bg-primary'

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

  const forecast = getMonthlyForecast(list)
  const growth = getSubscriptionsGrowth(list)
  const week = getWeekForecast(list)

  return (
    <div className="grid flex-1 gap-4 sm:grid-cols-3">
      {/* Расходы в месяц */}
      <Card className="h-full">
        <CardContent className="flex h-full flex-col px-5 py-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-muted-foreground">Расходы в месяц</p>
              <button
                className="text-muted-foreground/50 transition-colors hover:text-foreground"
                onClick={() => setBudgetOpen(true)}
                aria-label="Изменить лимит"
              >
                <Pencil size={12} />
              </button>
            </div>
            <Badge
              variant="outline"
              className="gap-1 rounded-full font-normal text-muted-foreground"
            >
              <Wallet size={12} /> ≈ {perDay} ₽/день
            </Badge>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
            {formatCurrency(monthlyTotal, 'RUB')}
          </p>

          {limit !== null && (
            <div className="mt-3 space-y-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${barColor}`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
              <p
                className={`text-xs ${
                  over ? 'font-medium text-destructive' : 'text-muted-foreground'
                }`}
              >
                {over
                  ? `Лимит превышен на ${formatCurrency(monthlyTotal - limit, 'RUB')}`
                  : `Осталось ${formatCurrency(limit - monthlyTotal, 'RUB')} из ${formatCurrency(limit, 'RUB')}`}
              </p>
            </div>
          )}

          <MiniAreaChart data={forecast} formatTick={rubTick} />

          <div className="mt-auto space-y-1 pt-4">
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
      <Card className="h-full">
        <CardContent className="flex h-full flex-col px-5 py-4">
          <div className="flex items-start justify-between gap-2">
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
          <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
            {active.length}
          </p>

          <MiniAreaChart data={growth} formatTick={countTick} />

          <div className="mt-auto space-y-1 pt-4">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Tag size={14} />
              {topCategory ? `Топ: ${topCategory}` : 'Пока нет подписок'}
            </p>
            <p className="text-sm text-muted-foreground">В архиве: {archived}</p>
          </div>
        </CardContent>
      </Card>

      {/* Списания за 7 дней */}
      <Card className="h-full">
        <CardContent className="flex h-full flex-col px-5 py-4">
          <div className="flex items-start justify-between gap-2">
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
          <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
            {formatCurrency(upcomingTotal, 'RUB')}
          </p>

          <MiniAreaChart data={week} formatTick={rubTick} />

          <div className="mt-auto space-y-1 pt-4">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <ArrowRight size={14} />
              {nearest ? `Ближайшее: ${nearest.name}` : 'Нет ближайших списаний'}
            </p>
            <p className="text-sm text-muted-foreground">
              {nearest
                ? formatBillingDate(nearest.nextBillingAt)
                : 'Все списания дальше недели'}
            </p>
          </div>
        </CardContent>
      </Card>

      <BudgetLimitDialog open={budgetOpen} onOpenChange={setBudgetOpen} />
    </div>
  )
})