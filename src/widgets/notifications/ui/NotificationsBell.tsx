import { Bell, CalendarClock } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSubscriptions } from '@/features/subscriptions/hooks/useSubscriptions'
import { formatCurrency } from '@/shared/lib/format'
import {
  formatBillingDate,
  getDaysUntilBilling,
  getUpcoming,
} from '@/entities/subscription/lib/calculations'

export function NotificationsBell() {
  const { data } = useSubscriptions()
  const upcoming = getUpcoming(data ?? []).sort(
    (a, b) => getDaysUntilBilling(a) - getDaysUntilBilling(b),
  )
  const total = upcoming.reduce((sum, s) => sum + s.price, 0)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
        <Bell size={16} />
        {upcoming.length > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
            {upcoming.length}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-2.5 py-1.5 text-sm font-medium">
          Списания на этой неделе
        </div>
        <DropdownMenuSeparator />
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
            <CalendarClock size={18} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Нет ближайших списаний</p>
          </div>
        ) : (
          <>
            {upcoming.map((s) => {
              const days = getDaysUntilBilling(s)
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-3 px-2 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBillingDate(s.nextBillingAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium tabular-nums">
                      {formatCurrency(s.price, s.currency)}
                    </p>
                    <p
                      className={`text-xs ${
                        days <= 1 ? 'text-destructive' : 'text-muted-foreground'
                      }`}
                    >
                      {days === 0
                        ? 'Сегодня'
                        : days === 1
                          ? 'Завтра'
                          : `Через ${days} дн.`}
                    </p>
                  </div>
                </div>
              )
            })}
            <DropdownMenuSeparator />
            <div className="flex items-center justify-between px-2 py-2">
              <p className="text-sm text-muted-foreground">Итого</p>
              <p className="text-sm font-semibold tabular-nums">
                {formatCurrency(total, 'RUB')}
              </p>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}