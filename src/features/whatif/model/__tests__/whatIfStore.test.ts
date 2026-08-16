import { describe, expect, it } from 'vitest'
import { whatIfStore } from '../whatIfStore'

describe('whatIfStore', () => {
  it('toggle включает и выключает подписку', () => {
    whatIfStore.reset()
    whatIfStore.toggle('1')
    expect(whatIfStore.isDisabled('1')).toBe(true)
    whatIfStore.toggle('1')
    expect(whatIfStore.isDisabled('1')).toBe(false)
  })

  it('reset очищает всё', () => {
    whatIfStore.toggle('1')
    whatIfStore.toggle('2')
    whatIfStore.reset()
    expect(whatIfStore.disabledIds).toHaveLength(0)
  })
})