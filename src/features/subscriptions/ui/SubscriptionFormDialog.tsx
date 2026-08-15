import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSubscriptionMutations } from '@/features/subscriptions/hooks/useSubscriptionMutations'
import { CATEGORIES } from '@/entities/subscription/model/constants'

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  category: z.string().min(1, 'Выбери категорию'),
  price: z
    .string()
    .min(1, 'Укажи цену')
    .refine((v) => Number(v) > 0, 'Цена должна быть больше 0'),
  currency: z.enum(['RUB', 'USD', 'EUR']),
  billingCycle: z.enum(['weekly', 'monthly', 'yearly']),
  nextBillingAt: z.string().min(1, 'Укажи дату'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubscriptionFormDialog({ open, onOpenChange }: Props) {
  const { create } = useSubscriptionMutations()
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      category: '',
      price: '',
      currency: 'RUB',
      billingCycle: 'monthly',
      nextBillingAt: '',
    },
  })

  useEffect(() => {
    if (open) reset()
  }, [open, reset])

  const onSubmit = handleSubmit((values) => {
    create.mutate(
      {
        ...values,
        price: Number(values.price),
        status: 'active',
      },
      { onSuccess: () => onOpenChange(false) },
    )
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Новая подписка</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Название</Label>
            <Input placeholder="Netflix" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Категория</Label>
            <Select
              onValueChange={(v) => {
                if (typeof v === 'string') {
                  setValue('category', v, { shouldValidate: true })
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выбери категорию" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Цена</Label>
              <Input type="number" placeholder="799" {...register('price')} />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Валюта</Label>
              <Select
                defaultValue="RUB"
                onValueChange={(v) => {
                  if (typeof v === 'string') {
                    setValue('currency', v as FormValues['currency'])
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RUB">₽ RUB</SelectItem>
                  <SelectItem value="USD">$ USD</SelectItem>
                  <SelectItem value="EUR">€ EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Цикл</Label>
              <Select
                defaultValue="monthly"
                onValueChange={(v) => {
                  if (typeof v === 'string') {
                    setValue('billingCycle', v as FormValues['billingCycle'])
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Еженедельно</SelectItem>
                  <SelectItem value="monthly">Ежемесячно</SelectItem>
                  <SelectItem value="yearly">Ежегодно</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Следующее списание</Label>
              <Input type="date" {...register('nextBillingAt')} />
              {errors.nextBillingAt && (
                <p className="text-sm text-destructive">
                  {errors.nextBillingAt.message}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Сохраняю...' : 'Добавить'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}