import type { RiskResponse } from '../api/client'

const COLORS: Record<string, string> = {
  Low:    'bg-green-100 text-green-700 border-green-300',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  High:   'bg-red-100 text-red-600 border-red-300',
}

const ICONS: Record<string, string> = {
  Low: '🟢', Medium: '🟡', High: '🔴',
}

interface Props {
  risk: RiskResponse | null
}

export default function RiskBadge({ risk }: Props) {
  if (!risk) return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-2">Risk Assessment</h2>
      <p className="text-slate-400 text-sm">Loading risk data...</p>
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Risk Assessment</h2>
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold text-lg mb-4 ${COLORS[risk.overall]}`}>
        {ICONS[risk.overall]} {risk.overall} Risk
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2 sm:grid-cols-3">
        {Object.entries(risk.breakdown).map(([ticker, level]) => (
          <div key={ticker} className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm ${COLORS[level]}`}>
            <span className="font-bold">{ticker}</span>
            <span>{level}</span>
          </div>
        ))}
      </div>
      <p className="text-slate-400 text-xs mt-3">
        Based on 5-day price volatility (standard deviation of daily returns)
      </p>
    </div>
  )
}
