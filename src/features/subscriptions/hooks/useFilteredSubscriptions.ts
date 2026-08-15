import { useMemo } from 'react'
import { useSubscriptions } from './useSubscriptions'
import { subscriptionFiltersStore } from '../model/filtersStore'
import { getDaysUntilBilling, getMonthlyCost } from '@/entities/subscription/lib/calculations'

export function useFilteredSubscriptions() {
  const { data, ...rest } = useSubscriptions()
  const { search, category, status, sortBy, onlyUpcoming } = subscriptionFiltersStore

  const filtered = useMemo(() => {
    let result = (data ?? [])

    if (status !== 'all') {
      result = result.filter((s) => s.status === status)
    }

    if (category !== 'all') {
      result = result.filter((s) => s.category === category)
    }

    if (search) {
      result = result.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (onlyUpcoming) {
      result = result.filter((s) => getDaysUntilBilling(s) <= 7)
    }

    switch (sortBy) {
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'price':
        result = [...result].sort((a, b) => getMonthlyCost(b) - getMonthlyCost(a))
        break
      case 'nextBilling':
      default:
        result = [...result].sort(
          (a, b) => getDaysUntilBilling(a) - getDaysUntilBilling(b),
        )
    }

    return result
  }, [data, search, category, status, sortBy, onlyUpcoming])

  return { data: filtered, ...rest }
}