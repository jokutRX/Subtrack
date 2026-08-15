import { observer } from 'mobx-react-lite'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSubscriptions } from '@/features/subscriptions/hooks/useSubscriptions'
import { formatCurrency } from '@/shared/lib/format'
import { getMonthlyCost } from '@/entities/subscription/lib/calculations'
import { getCategoryStyle } from '@/entities/subscription/model/constants'
import { whatIfStore } from '../model/whatIfStore'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const WhatIfDialog = observer(({ open, onOpenChange }: Props) => {
  const { data } = useSubscriptions()
  const active = (data ?? []).filter((s) => s.status === 'active')

  const disabledSubs = active.filter((s) => whatIfStore.isDisabled(s.id))
  const monthlySave = disabledSubs.reduce(
    (sum, s) => sum + getMonthlyCost(s),
    0,
  )
  const totalMonthly = active.reduce((sum, s) => sum + getMonthlyCost(s), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Что если…</DialogTitle>
          <DialogDescription>
            Отключи ненужные подписки и посмотри, сколько сэкономишь.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1 rounded-lg border bg-muted/50 px-4 py-3">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-muted-foreground">Ты сэкономишь</p>
            <p className="text-2xl font-semibold tabular-nums text-green-600 dark:text-green-400">
              {formatCurrency(monthlySave, 'RUB')}/мес
            </p>
          </div>
          <div className="flex items-baseline justify-between text-sm">
            <p className="text-muted-foreground">Это</p>
            <p className="font-medium tabular-nums">
              {formatCurrency(monthlySave * 12, 'RUB')}/год
            </p>
          </div>
          <div className="flex items-baseline justify-between text-sm">
            <p className="text-muted-foreground">Расходы станут</p>
            <p className="tabular-nums">
              {formatCurrency(totalMonthly, 'RUB')} →{' '}
              <span className="font-medium">
                {formatCurrency(totalMonthly - monthlySave, 'RUB')}
              </span>
              /мес
            </p>
          </div>
        </div>

        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {active.map((s) => {
            const off = whatIfStore.isDisabled(s.id)
            return (
              <div
                key={s.id}
                className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-opacity ${
                  off ? 'opacity-60' : ''
                }`}
              >
                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-medium ${
                      off ? 'line-through' : ''
                    }`}
                  >
                    {s.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={getCategoryStyle(s.category)}
                    >
                      {s.category}
                    </Badge>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {formatCurrency(getMonthlyCost(s), s.currency)}/мес
                    </span>
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={!off}
                  onClick={() => whatIfStore.toggle(s.id)}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                    off ? 'bg-destructive' : 'bg-emerald-500'
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      off ? 'translate-x-4' : ''
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => whatIfStore.reset()}>
            Сбросить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
})