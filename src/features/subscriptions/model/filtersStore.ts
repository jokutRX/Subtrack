import { makeAutoObservable } from 'mobx'

class SubscriptionFiltersStore {
  search = ''
  category = 'all'

  constructor() {
    makeAutoObservable(this)
  }

  setSearch(value: string) {
    this.search = value
  }

  setCategory(value: string) {
    this.category = value
  }

  reset() {
    this.search = ''
    this.category = 'all'
  }

  get isActive() {
    return this.search !== '' || this.category !== 'all'
  }
}

export const subscriptionFiltersStore = new SubscriptionFiltersStore()