import { Archive, MoreHorizontal, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useFilteredSubscriptions } from '@/features/subscriptions/hooks/useFilteredSubscriptions'
import { useSubscriptionMutations } from '@/features/subscriptions/hooks/useSubscriptionMutations'
import { formatCurrency } from '@/shared/lib/format'
import {
  formatBillingDate,
  getDaysUntilBilling,
  getMonthlyCost,
} from '@/entities/subscription/lib/calculations'
import {
  BILLING_CYCLE_LABELS,
  getCategoryStyle,
} from '@/entities/subscription/model/constants'
import type { Subscription } from '@/entities/subscription/model/types'

function NextChargeCell({ sub }: { sub: Subscription }) {
  const days = getDaysUntilBilling(sub)
  const tone =
    days < 0
      ? 'text-destructive'
      : days <= 3
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-muted-foreground'
  const label =
    days < 0
      ? `Просрочено на ${Math.abs(days)} дн.`
      : days === 0
        ? 'Сегодня'
        : days === 1
          ? 'Завтра'
          : `Через ${days} дн.`

  return (
    <div className="flex flex-col items-end">
      <span className={tone}>{label}</span>
      <span className="text-xs text-muted-foreground">
        {formatBillingDate(sub.nextBillingAt)}
      </span>
    </div>
  )
}

export function SubscriptionsTable() {
  const { data } = useFilteredSubscriptions()
  const { remove, update } = useSubscriptionMutations()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Цикл</TableHead>
          <TableHead className="text-right">В месяц</TableHead>
          <TableHead className="text-right">Следующее списание</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="font-medium">{s.name}</TableCell>
            <TableCell>
              <Badge variant="outline" className={getCategoryStyle(s.category)}>
                {s.category}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {BILLING_CYCLE_LABELS[s.billingCycle]}
            </TableCell>
            <TableCell className="text-right font-medium tabular-nums">
              {formatCurrency(getMonthlyCost(s), s.currency)}
            </TableCell>
            <TableCell className="text-right">
              <NextChargeCell sub={s} />
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <MoreHorizontal size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      update.mutate({ id: s.id, data: { status: 'archived' } })
                    }
                  >
                    <Archive size={14} className="mr-2" /> В архив
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => remove.mutate(s.id)}
                  >
                    <Trash2 size={14} className="mr-2" /> Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}