import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { subscriptionsApi } from '@/entities/subscription/api/subscriptionsApi'
import { budgetStore } from '@/features/budget/model/budgetStore'
import type { Subscription } from '@/entities/subscription/model/types'

export function useSubscriptionMutations() {
  const queryClient = useQueryClient()
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['subscriptions'] })

  const create = useMutation({
    mutationFn: (data: Omit<Subscription, 'id' | 'createdAt'>) =>
      subscriptionsApi.create(data),
    onSuccess: () => {
      invalidate()
      toast.success('Подписка добавлена')
    },
    onError: () => toast.error('Не удалось добавить подписку'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Subscription> }) =>
      subscriptionsApi.update(id, data),
    onSuccess: (sub) => {
      invalidate()
      toast.success(
        sub.status === 'archived'
          ? 'Подписка перемещена в архив'
          : 'Изменения сохранены',
      )
    },
    onError: () => toast.error('Не удалось сохранить изменения'),
  })

  const remove = useMutation({
    mutationFn: (id: string) => subscriptionsApi.remove(id),
    onSuccess: () => {
      invalidate()
      toast.success('Подписка удалена')
    },
    onError: () => toast.error('Не удалось удалить подписку'),
  })

  const resetDemo = useMutation({
    mutationFn: () => subscriptionsApi.resetDemo(),
    onSuccess: () => {
      invalidate()
      if (budgetStore.limit === null) budgetStore.setLimit(3000)
      toast.success('Демо-данные сброшены')
    },
    onError: () => toast.error('Не удалось сбросить демо-данные'),
  })

  return { create, update, remove, resetDemo }
}