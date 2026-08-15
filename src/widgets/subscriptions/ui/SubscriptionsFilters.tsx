import { observer } from 'mobx-react-lite'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { subscriptionFiltersStore } from '@/features/subscriptions/model/filtersStore'
import { CATEGORIES } from '@/entities/subscription/model/constants'

export const SubscriptionsFilters = observer(() => {
  const store = subscriptionFiltersStore

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Поиск по названию..."
          value={store.search}
          onChange={(e) => store.setSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={store.category}
          onValueChange={(v) => {
            if (typeof v === 'string') store.setCategory(v)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Категория" />
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
        {store.isActive && (
          <Button variant="ghost" size="icon" onClick={() => store.reset()}>
            <X size={16} />
          </Button>
        )}
      </div>
    </div>
  )
})