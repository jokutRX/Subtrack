import { useMemo } from 'react'
import { useSubscriptions } from './useSubscriptions'
import { subscriptionFiltersStore } from '../model/filtersStore'
import { getDaysUntilBilling } from '@/entities/subscription/lib/calculations'

export function useFilteredSubscriptions() {
  const { data, ...rest } = useSubscriptions()
  const { search, category } = subscriptionFiltersStore

  const filtered = useMemo(
    () =>
      (data ?? [])
        .filter((s) => s.status === 'active')
        .filter((s) => category === 'all' || s.category === category)
        .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => getDaysUntilBilling(a) - getDaysUntilBilling(b)),
    [data, search, category],
  )

  return { data: filtered, ...rest }
}