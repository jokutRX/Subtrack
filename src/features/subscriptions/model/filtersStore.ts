import { makeAutoObservable } from 'mobx'

type StatusFilter = 'all' | 'active' | 'archived'
type SortBy = 'name' | 'price' | 'nextBilling'

class SubscriptionFiltersStore {
  search = ''
  category = 'all'
  status: StatusFilter = 'active'
  sortBy: SortBy = 'nextBilling'
  onlyUpcoming = false

  constructor() {
    makeAutoObservable(this)
  }

  setSearch(value: string) {
    this.search = value
  }

  setCategory(value: string) {
    this.category = value
  }

  setStatus(value: StatusFilter) {
    this.status = value
  }

  setSortBy(value: SortBy) {
    this.sortBy = value
  }

  setOnlyUpcoming(value: boolean) {
    this.onlyUpcoming = value
  }

  reset() {
    this.search = ''
    this.category = 'all'
    this.status = 'active'
    this.sortBy = 'nextBilling'
    this.onlyUpcoming = false
  }

  get isActive() {
    return (
      this.search !== '' ||
      this.category !== 'all' ||
      this.status !== 'active' ||
      this.sortBy !== 'nextBilling' ||
      this.onlyUpcoming
    )
  }
}

export const subscriptionFiltersStore = new SubscriptionFiltersStore()