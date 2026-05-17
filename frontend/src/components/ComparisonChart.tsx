import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { DayValue } from '../api/client'

const COLORS: Record<string, string> = {
  Ethical: '#10b981',
  Growth:  '#0ea5e9',
  Index:   '#8b5cf6',
  Quality: '#f59e0b',
  Value:   '#f43f5e',
}

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '13px',
}

interface Props {
  data: Record<string, DayValue[]> | null
  amount: number
}

export default function ComparisonChart({ data, amount }: Props) {
  if (!data) return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl p-6 flex items-center justify-center h-64">
      <div className="text-center">
        <div className="flex justify-center mb-3"><span className="spinner" /></div>
        <p className="text-slate-500 text-sm">Loading strategy comparison...</p>
      </div>
    </div>
  )

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
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Strategy Comparison</h2>
        <p className="text-slate-400 text-sm mt-0.5">
          How ${amount.toLocaleString()} would have performed across all strategies over 5 days
        </p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#475569' }} />
            <YAxis
              tick={{ fontSize: 11, fill: '#475569' }}
              tickFormatter={v => `$${(v / 1000).toFixed(1)}k`}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
              formatter={(v, name) => [
                `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                name,
              ]}
            />
            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
            {Object.keys(data).map(strategy => (
              <Line
                key={strategy}
                type="monotone"
                dataKey={strategy}
                stroke={COLORS[strategy]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
