import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionsApi } from '@/entities/subscription/api/subscriptionsApi'
import type { Subscription } from '@/entities/subscription/model/types'
import { toast } from 'sonner'

export const useSubscriptionMutations = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: subscriptionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      toast.success('Subscription created')
    },
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Subscription> }) =>
      subscriptionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      toast.success('Subscription updated')
    },
  })

  const remove = useMutation({
    mutationFn: subscriptionsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      toast.success('Subscription removed')
    },
  })

  return { create, update, remove }
}