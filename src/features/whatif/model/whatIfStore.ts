import { makeAutoObservable } from 'mobx'

class WhatIfStore {
  disabledIds: string[] = []

  constructor() {
    makeAutoObservable(this)
  }

  toggle(id: string) {
    this.disabledIds = this.disabledIds.includes(id)
      ? this.disabledIds.filter((x) => x !== id)
      : [...this.disabledIds, id]
  }

  isDisabled(id: string) {
    return this.disabledIds.includes(id)
  }

  reset() {
    this.disabledIds = []
  }
}

export const whatIfStore = new WhatIfStore()