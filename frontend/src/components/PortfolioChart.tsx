import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { DayValue } from '../api/client'

interface Props {
  data: DayValue[]
  total: number
}

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '13px',
}

export default function PortfolioChart({ data, total }: Props) {
  if (!data.length) return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl p-6 flex items-center justify-center h-64">
      <div className="text-center">
        <div className="flex justify-center mb-3"><span className="spinner" /></div>
        <p className="text-slate-500 text-sm">Loading chart data...</p>
      </div>
    </div>
  )

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
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700/50 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">5-Day Portfolio Trend</h2>
          <p className="text-slate-400 text-sm mt-0.5">Scaled to your investment amount</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            ${latest.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-sm font-semibold ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {positive ? '▲' : '▼'} {positive ? '+' : ''}{change.toFixed(2)} ({positive ? '+' : ''}{changePct}%)
          </p>
        </div>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={scaled} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              formatter={v => [`$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'Portfolio Value']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#portfolioGrad)"
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#818cf8', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
