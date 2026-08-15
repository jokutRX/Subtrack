import { Inbox, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  hasFilters: boolean
  onAdd: () => void
  onReset: () => void
}

export function SubscriptionsEmptyState({ hasFilters, onAdd, onReset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Inbox size={20} className="text-muted-foreground" />
      </div>
      {hasFilters ? (
        <>
          <p className="font-medium">Ничего не найдено</p>
          <p className="text-sm text-muted-foreground">
            Попробуй изменить параметры поиска
          </p>
          <Button variant="outline" onClick={onReset}>
            Сбросить фильтры
          </Button>
        </>
      ) : (
        <>
          <p className="font-medium">Пока нет подписок</p>
          <p className="text-sm text-muted-foreground">
            Добавь первую подписку, чтобы начать отслеживать расходы
          </p>
          <Button onClick={onAdd}>
            <Plus size={16} className="mr-2" /> Добавить подписку
          </Button>
        </>
      )}
    </div>
  )
}