import type { StockItem } from '../api/client'

const TICKER_SECTORS: Record<string, string> = {
  AAPL: 'Technology',   ADBE: 'Technology',  MSFT: 'Technology',  NVDA: 'Technology',
  TSLA: 'Consumer Discretionary', AMZN: 'Consumer Discretionary',
  NSRGY: 'Consumer Staples', PG: 'Consumer Staples',
  JNJ: 'Healthcare',
  'BRK-B': 'Financials', JPM: 'Financials',
  XOM: 'Energy',
  VTI: 'Diversified ETF', IXUS: 'Diversified ETF',
  ILTB: 'Fixed Income ETF',
}

const SECTOR_COLORS: Record<string, { bar: string; text: string; bg: string }> = {
  'Technology':              { bar: 'bg-sky-500',     text: 'text-sky-400',    bg: 'bg-sky-500/10' },
  'Consumer Discretionary':  { bar: 'bg-violet-500',  text: 'text-violet-400', bg: 'bg-violet-500/10' },
  'Consumer Staples':        { bar: 'bg-emerald-500', text: 'text-emerald-400',bg: 'bg-emerald-500/10' },
  'Healthcare':              { bar: 'bg-rose-500',    text: 'text-rose-400',   bg: 'bg-rose-500/10' },
  'Financials':              { bar: 'bg-amber-500',   text: 'text-amber-400',  bg: 'bg-amber-500/10' },
  'Energy':                  { bar: 'bg-orange-500',  text: 'text-orange-400', bg: 'bg-orange-500/10' },
  'Diversified ETF':         { bar: 'bg-cyan-500',    text: 'text-cyan-400',   bg: 'bg-cyan-500/10' },
  'Fixed Income ETF':        { bar: 'bg-indigo-500',  text: 'text-indigo-400', bg: 'bg-indigo-500/10' },
}

const DEFAULT_COLOR = { bar: 'bg-slate-500', text: 'text-slate-400', bg: 'bg-slate-500/10' }

interface Props {
  stocks: StockItem[]
}

export default function SectorBreakdown({ stocks }: Props) {
  const equalWeight = 100 / stocks.length

  // Group by sector, summing weights
  const sectorMap: Record<string, { weight: number; tickers: string[] }> = {}
  for (const s of stocks) {
    const sector = TICKER_SECTORS[s.ticker] ?? 'Other'
    if (!sectorMap[sector]) sectorMap[sector] = { weight: 0, tickers: [] }
    sectorMap[sector].weight += equalWeight
    sectorMap[sector].tickers.push(s.ticker)
  }

  const sectors = Object.entries(sectorMap).sort((a, b) => b[1].weight - a[1].weight)

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Sector Breakdown</h2>
        <p className="text-slate-400 text-sm mt-0.5">Portfolio exposure by market sector</p>
      </div>
      <div className="px-6 py-4 space-y-3">
        {sectors.map(([sector, { weight, tickers }]) => {
          const c = SECTOR_COLORS[sector] ?? DEFAULT_COLOR
          return (
            <div key={sector}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${c.text}`}>{sector}</span>
                  <span className="text-slate-600 text-xs">{tickers.join(', ')}</span>
                </div>
                <span className={`text-sm font-bold ${c.text}`}>{weight.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-700/40 rounded-full h-2">
                <div
                  className={`${c.bar} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${weight}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
