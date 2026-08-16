import { useCountUp } from '@/shared/lib/useCountUp'

interface Props {
  value: number
  format?: (n: number) => string
  duration?: number
  className?: string
}

export function AnimatedNumber({ value, format, duration, className }: Props) {
  const display = useCountUp(value, duration)
  return <span className={className}>{format ? format(display) : display}</span>
}