import { useEffect } from 'react'
import { useSubscriptions } from '@/features/subscriptions/hooks/useSubscriptions'
import { checkBillingReminders } from '../model/notificationStore'

export function useBillingReminders() {
  const { data } = useSubscriptions()

  useEffect(() => {
    if (data) checkBillingReminders(data)
  }, [data])
}