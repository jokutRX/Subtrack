import { useQuery } from '@tanstack/react-query'
import { subscriptionsApi } from '@/entities/subscription/api/subscriptionsApi'
import type { Subscription } from '@/entities/subscription/model/types'

export const useSubscriptions = () =>
  useQuery<Subscription[]>({
    queryKey: ['subscriptions'],
    queryFn: subscriptionsApi.list,
  })