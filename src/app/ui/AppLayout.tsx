import type { ReactNode } from 'react'
import { observer } from 'mobx-react-lite'
import { Moon, Sun, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { NotificationsBell } from '@/widgets/notifications/ui/NotificationsBell'
import { themeStore } from '@/features/theme/model/themeStore'

export const AppLayout = observer(({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet size={16} />
            </div>
            <span className="text-lg font-semibold tracking-tight">SubTrack</span>
          </div>
          <div className="flex items-center gap-1">
            <NotificationsBell />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => themeStore.toggle()}
              aria-label="Переключить тему"
            >
              {themeStore.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-6 py-8">{children}</main>
      <Toaster />
    </div>
  )
})