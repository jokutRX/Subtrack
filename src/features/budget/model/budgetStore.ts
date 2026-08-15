import { makeAutoObservable } from 'mobx'

const KEY = 'subtrack_budget_limit'

class BudgetStore {
  limit: number | null = null

  constructor() {
    const raw = localStorage.getItem(KEY)
    this.limit = raw !== null && !Number.isNaN(Number(raw)) ? Number(raw) : null
    makeAutoObservable(this)
  }

  setLimit(value: number | null) {
    this.limit = value
    if (value === null) {
      localStorage.removeItem(KEY)
    } else {
      localStorage.setItem(KEY, String(value))
    }
  }
}

export const budgetStore = new BudgetStore()