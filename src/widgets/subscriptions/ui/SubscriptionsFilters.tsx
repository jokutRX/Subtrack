import { observer } from 'mobx-react-lite'
import { Filter, RefreshCw, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { subscriptionFiltersStore } from '@/features/subscriptions/model/filtersStore'
import { useSubscriptionMutations } from '@/features/subscriptions/hooks/useSubscriptionMutations'
import { CATEGORIES } from '@/entities/subscription/model/constants'

const STATUS_LABELS: Record<string, string> = {
  all: 'Все',
  active: 'Активные',
  archived: 'В архиве',
}

const SORT_LABELS: Record<string, string> = {
  nextBilling: 'По дате списания',
  price: 'По цене',
  name: 'По названию',
}

export const SubscriptionsFilters = observer(() => {
  const store = subscriptionFiltersStore
  const { resetDemo } = useSubscriptionMutations()

  return (
    <div className="flex h-full flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Фильтры</p>
        {store.isActive && (
          <Button variant="ghost" size="sm" onClick={() => store.reset()}>
            <X size={14} className="mr-1" /> Сбросить
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Поиск по названию..."
          value={store.search}
          onChange={(e) => store.setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">Категория</Label>
        <Select
          value={store.category}
          onValueChange={(v) => {
            if (typeof v === 'string') store.setCategory(v)
          }}
        >
          <SelectTrigger className="w-full">
            <span className="truncate">
              {store.category === 'all' ? 'Все категории' : store.category}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">Статус</Label>
        <Select
          value={store.status}
          onValueChange={(v) => {
            if (typeof v === 'string')
              store.setStatus(v as 'all' | 'active' | 'archived')
          }}
        >
          <SelectTrigger className="w-full">
            <span>{STATUS_LABELS[store.status]}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="archived">В архиве</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">Сортировка</Label>
        <Select
          value={store.sortBy}
          onValueChange={(v) => {
            if (typeof v === 'string')
              store.setSortBy(v as 'name' | 'price' | 'nextBilling')
          }}
        >
          <SelectTrigger className="w-full">
            <span>{SORT_LABELS[store.sortBy]}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nextBilling">По дате списания</SelectItem>
            <SelectItem value="price">По цене</SelectItem>
            <SelectItem value="name">По названию</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-auto space-y-2">
        <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted">
          <input
            type="checkbox"
            checked={store.onlyUpcoming}
            onChange={(e) => store.setOnlyUpcoming(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <Filter size={14} className="text-muted-foreground" />
          Ближайшие 7 дней
        </label>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={() => resetDemo.mutate()}
        >
          <RefreshCw size={14} className="mr-2" />
          Сбросить демо-данные
        </Button>
      </div>
    </div>
  )
})