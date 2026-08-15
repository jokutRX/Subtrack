import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b px-6 py-4">
        <h1 className="text-xl font-bold">SubTrack</h1>
      </header>
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  )
}