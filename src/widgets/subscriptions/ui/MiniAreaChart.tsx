import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

export default function MiniAreaChart({
  data,
  formatTick,
}: {
  data: { label: string; total: number }[]
  formatTick: (v: number) => string
}) {
  return (
    <div className="mt-4 h-24 text-muted-foreground">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="cardAreaBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="currentColor"
            strokeOpacity={0.15}
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            interval={0}
            dy={4}
            tick={{ fill: 'currentColor', fontSize: 9 }}
          />
          <YAxis
            orientation="right"
            axisLine={false}
            tickLine={false}
            width={34}
            tick={{ fill: 'currentColor', fontSize: 9 }}
            tickFormatter={formatTick}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#cardAreaBlue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}