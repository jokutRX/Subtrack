import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { budgetStore } from '../model/budgetStore'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const BudgetLimitDialog = observer(({ open, onOpenChange }: Props) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (open) setValue(budgetStore.limit !== null ? String(budgetStore.limit) : '')
  }, [open])

  const save = () => {
    const n = Number(value)
    budgetStore.setLimit(value !== '' && n > 0 ? n : null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Месячный лимит</DialogTitle>
          <DialogDescription>
            Покажем прогресс в карточке расходов и предупредим о превышении.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label>Лимит, ₽ в месяц</Label>
          <Input
            type="number"
            placeholder="Например, 3000"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              budgetStore.setLimit(null)
              onOpenChange(false)
            }}
          >
            Убрать лимит
          </Button>
          <Button className="flex-1" onClick={save}>
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
})