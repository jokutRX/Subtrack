import { useQuery } from '@tanstack/react-query'
import { subscriptionsApi } from '@/entities/subscription/api/subscriptionsApi'

export const useSubscriptions = () =>
  useQuery({
    queryKey: ['subscriptions'],
    queryFn: subscriptionsApi.list,
  })