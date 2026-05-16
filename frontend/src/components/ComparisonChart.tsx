import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import type { DayValue } from '../api/client'

const COLORS: Record<string, string> = {
  Ethical: '#10b981',
  Growth:  '#3b82f6',
  Index:   '#8b5cf6',
  Quality: '#f59e0b',
  Value:   '#ef4444',
}

interface Props {
  data: Record<string, DayValue[]> | null
  amount: number
}

export default function ComparisonChart({ data, amount }: Props) {
  if (!data) return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-center h-64">
      <p className="text-slate-400">Loading strategy comparison...</p>
    </div>
  )

  // Build a unified date-keyed dataset
  const dates = new Set<string>()
  Object.values(data).forEach(arr => arr.forEach(d => dates.add(d.date)))

  const chartData = Array.from(dates).sort().map(date => {
    const row: Record<string, number | string> = { date }
    for (const [strategy, arr] of Object.entries(data)) {
      const base = arr[0]?.value || 1
      const point = arr.find(d => d.date === date)
      if (point) row[strategy] = Math.round((point.value / base) * amount * 100) / 100
    }
    return row
  })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Strategy Comparison</h2>
        <p className="text-slate-400 text-sm mt-0.5">
          How ${amount.toLocaleString()} would have performed across all strategies over 5 days
        </p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              tickFormatter={v => `$${(v / 1000).toFixed(1)}k`}
              domain={['auto', 'auto']}
            />
            <Tooltip
              formatter={(v, name) => [
                `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                name,
              ]}
            />
            <Legend />
            {Object.keys(data).map(strategy => (
              <Line
                key={strategy}
                type="monotone"
                dataKey={strategy}
                stroke={COLORS[strategy]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
