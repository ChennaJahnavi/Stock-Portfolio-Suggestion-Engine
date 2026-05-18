import type { RiskResponse } from '../api/client'

const LEVEL_CONFIG: Record<string, { bg: string; text: string; border: string; dot: string; glow?: string }> = {
  Low:    { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', dot: 'bg-emerald-400' },
  Medium: { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/40',   dot: 'bg-amber-400' },
  High:   { bg: 'bg-rose-500/15',    text: 'text-rose-400',    border: 'border-rose-500/40',     dot: 'bg-rose-500', glow: 'risk-high-pulse' },
}

const ICONS: Record<string, string> = { Low: '🟢', Medium: '🟡', High: '🔴' }

const DESCRIPTIONS: Record<string, string> = {
  Low: 'Stable portfolio with minimal price swings',
  Medium: 'Moderate volatility, balanced risk/reward',
  High: 'High volatility — significant price swings possible',
}

interface Props {
  risk: RiskResponse | null
}

export default function RiskBadge({ risk }: Props) {
  if (!risk) return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl p-6 flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <span className="spinner" />
        </div>
        <p className="text-slate-500 text-sm">Loading risk data...</p>
      </div>
    </div>
  )

  const cfg = LEVEL_CONFIG[risk.overall] ?? LEVEL_CONFIG.Medium

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl p-6">
      <h2 className="text-lg font-bold text-white mb-4">Risk Assessment</h2>

      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 mb-4 ${cfg.bg} ${cfg.border} ${cfg.glow ?? ''}`}>
        <span className="text-2xl">{ICONS[risk.overall]}</span>
        <div>
          <p className={`text-xl font-bold ${cfg.text}`}>{risk.overall} Risk</p>
          <p className="text-slate-500 text-xs mt-0.5">{DESCRIPTIONS[risk.overall]}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(risk.breakdown).map(([ticker, level]) => {
          const c = LEVEL_CONFIG[level] ?? LEVEL_CONFIG.Medium
          return (
            <div key={ticker} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${c.bg} ${c.border}`}>
              <div className={`w-2 h-2 rounded-full ${c.dot} flex-shrink-0`} />
              <span className="font-bold text-white text-xs">{ticker}</span>
              <span className={`text-xs font-semibold ${c.text}`}>{level}</span>
            </div>
          )
        })}
      </div>

      <p className="text-slate-600 text-xs mt-4">
        Based on 5-day price volatility (std dev of daily returns)
      </p>
    </div>
  )
}
