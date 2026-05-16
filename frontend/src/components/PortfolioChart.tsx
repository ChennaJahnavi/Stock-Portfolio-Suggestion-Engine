import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import type { DayValue } from '../api/client'

interface Props {
  data: DayValue[]
  total: number
}

export default function PortfolioChart({ data, total }: Props) {
  if (!data.length) return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-center h-64">
      <p className="text-slate-400">Loading chart data...</p>
    </div>
  )

  // Scale the index price trend to reflect the actual portfolio value
  const base = data[0]?.value || 1
  const scaled = data.map(d => ({
    date: d.date,
    value: Math.round((d.value / base) * total * 100) / 100,
  }))

  const latest = scaled[scaled.length - 1]?.value ?? total
  const change = latest - total
  const changePct = ((change / total) * 100).toFixed(2)
  const positive = change >= 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">5-Day Portfolio Trend</h2>
          <p className="text-slate-400 text-sm mt-0.5">Scaled to your investment amount</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800">
            ${latest.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-sm font-semibold ${positive ? 'text-green-600' : 'text-red-500'}`}>
            {positive ? '+' : ''}{change.toFixed(2)} ({positive ? '+' : ''}{changePct}%)
          </p>
        </div>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={scaled} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              tickFormatter={v => `$${(v / 1000).toFixed(1)}k`}
              domain={['auto', 'auto']}
            />
            <Tooltip
              formatter={(v) => [`$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'Portfolio Value']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
