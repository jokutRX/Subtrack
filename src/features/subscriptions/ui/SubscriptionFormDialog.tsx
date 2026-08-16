import { useState } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { useSubscriptionMutations } from '../hooks/useSubscriptionMutations'
import {
  BILLING_CYCLE_LABELS,
  CATEGORIES,
} from '@/entities/subscription/model/constants'
import type { BillingCycle } from '@/entities/subscription/model/types'

const CURRENCIES = ['RUB', 'USD', 'EUR'] as const

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubscriptionFormDialog({ open, onOpenChange }: Props) {
  const { create } = useSubscriptionMutations()
  const today = format(new Date(), 'yyyy-MM-dd')

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState<'RUB' | 'USD' | 'EUR'>('RUB')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [nextBillingAt, setNextBillingAt] = useState('')
  const [dateError, setDateError] = useState(false)

  const reset = () => {
    setName('')
    setCategory('')
    setPrice('')
    setCurrency('RUB')
    setBillingCycle('monthly')
    setNextBillingAt('')
    setDateError(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (nextBillingAt < today) {
      setDateError(true)
      return
    }

    create.mutate(
      {
        name: name.trim(),
        category,
        price: Number(price),
        currency,
        billingCycle,
        nextBillingAt,
        status: 'active',
      },
      {
        onSuccess: () => {
          reset()
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset()
        onOpenChange(v)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Новая подписка</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-1.5">
            <Label>Название</Label>
            <Input
              placeholder="Netflix"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Категория</Label>
            <Select
              value={category}
              onValueChange={(v) => {
                if (typeof v === 'string') setCategory(v)
              }}
            >
              <SelectTrigger className="w-full">
                <span className="truncate">
                  {category === '' ? 'Выбери категорию' : category}
                </span>
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Цена</Label>
              <Input
                type="number"
                min="0"
                step="any"
                placeholder="799"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Валюта</Label>
              <Select
                value={currency}
                onValueChange={(v) => {
                  if (typeof v === 'string')
                    setCurrency(v as 'RUB' | 'USD' | 'EUR')
                }}
              >
                <SelectTrigger className="w-full">
                  <span>{currency}</span>
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Цикл</Label>
              <Select
                value={billingCycle}
                onValueChange={(v) => {
                  if (typeof v === 'string')
                    setBillingCycle(v as BillingCycle)
                }}
              >
                <SelectTrigger className="w-full">
                  <span>{BILLING_CYCLE_LABELS[billingCycle]}</span>
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.keys(BILLING_CYCLE_LABELS) as BillingCycle[]
                  ).map((c) => (
                    <SelectItem key={c} value={c}>
                      {BILLING_CYCLE_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Следующее списание</Label>
              <Input
                type="date"
                min={today}
                value={nextBillingAt}
                onChange={(e) => {
                  setNextBillingAt(e.target.value)
                  setDateError(e.target.value < today)
                }}
                required
              />
              {dateError && (
                <p className="text-xs text-destructive">
                  Дата не может быть в прошлом
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={create.isPending}>
            Добавить
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}