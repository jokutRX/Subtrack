import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StatsCards } from '@/widgets/subscriptions/ui/StatsCards'
import { SubscriptionsFilters } from '@/widgets/subscriptions/ui/SubscriptionsFilters'
import { SubscriptionsTable } from '@/widgets/subscriptions/ui/SubscriptionsTable'
import { SubscriptionsEmptyState } from '@/widgets/subscriptions/ui/SubscriptionsEmptyState'
import { SubscriptionFormDialog } from '@/features/subscriptions/ui/SubscriptionFormDialog'
import { WhatIfDialog } from '@/features/whatif/ui/WhatIfDialog'
import { useSubscriptions } from '@/features/subscriptions/hooks/useSubscriptions'
import { useFilteredSubscriptions } from '@/features/subscriptions/hooks/useFilteredSubscriptions'
import { subscriptionFiltersStore } from '@/features/subscriptions/model/filtersStore'

export const SubscriptionsPage = observer(() => {
  const [addOpen, setAddOpen] = useState(false)
  const [whatIfOpen, setWhatIfOpen] = useState(false)
  const { data: all } = useSubscriptions()
  const { data: filtered, isLoading, isError } = useFilteredSubscriptions()

  const hasAny = (all ?? []).length > 0
  const showEmpty = !isLoading && !isError && filtered.length === 0

  return (
    <div className="space-y-6">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Подписки</h2>
              <p className="text-sm text-muted-foreground">
                Контроль регулярных платежей и расходов
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setWhatIfOpen(true)}>
                <Sparkles size={16} className="mr-2" /> Что если…
              </Button>
              <Button onClick={() => setAddOpen(true)}>
                <Plus size={16} className="mr-2" /> Добавить
              </Button>
            </div>
          </div>
          <StatsCards />
        </div>
        <SubscriptionsFilters />
      </div>

      {isLoading && <Skeleton className="h-64 w-full" />}
      {isError && <p className="text-destructive">Не удалось загрузить данные</p>}

      {showEmpty ? (
        <SubscriptionsEmptyState
          hasFilters={hasAny}
          onAdd={() => setAddOpen(true)}
          onReset={() => subscriptionFiltersStore.reset()}
        />
      ) : (
        !isLoading &&
        !isError && (
          <Card>
            <CardContent className="p-0">
              <SubscriptionsTable />
            </CardContent>
          </Card>
        )
      )}

      <SubscriptionFormDialog open={addOpen} onOpenChange={setAddOpen} />
      <WhatIfDialog open={whatIfOpen} onOpenChange={setWhatIfOpen} />
    </div>
  )
})