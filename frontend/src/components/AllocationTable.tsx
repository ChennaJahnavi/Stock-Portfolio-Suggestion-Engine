import { useState, useEffect } from 'react'
import type { StockItem } from '../api/client'

const TICKER_COLORS = [
  { dot: 'bg-sky-400',     accent: '#0ea5e9' },
  { dot: 'bg-emerald-400', accent: '#10b981' },
  { dot: 'bg-violet-400',  accent: '#8b5cf6' },
  { dot: 'bg-amber-400',   accent: '#f59e0b' },
  { dot: 'bg-rose-400',    accent: '#f43f5e' },
  { dot: 'bg-cyan-400',    accent: '#06b6d4' },
]

interface Props {
  stocks: StockItem[]
  total: number
}

export default function AllocationTable({ stocks, total }: Props) {
  const [weights, setWeights] = useState<Record<string, number>>({})

  useEffect(() => {
    const even = 100 / stocks.length
    setWeights(Object.fromEntries(stocks.map(s => [s.ticker, Math.round(even * 10) / 10])))
  }, [stocks])

  const handleSlider = (ticker: string, val: number) => {
    const remaining = 100 - val
    const others = stocks.filter(s => s.ticker !== ticker)
    const updated: Record<string, number> = { [ticker]: val }
    others.forEach(s => {
      updated[s.ticker] = Math.round((remaining / others.length) * 10) / 10
    })
    setWeights(updated)
  }

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)

  const exportCSV = () => {
    const rows = [
      ['Ticker', 'Company', 'Live Price ($)', 'Allocated ($)', 'Shares', 'Weight (%)'],
      ...stocks.map(s => {
        const w = weights[s.ticker] ?? (100 / stocks.length)
        const alloc = total * (w / 100)
        const shares = alloc / s.price
        return [s.ticker, s.name, s.price.toFixed(2), alloc.toFixed(2), shares.toFixed(4), w.toFixed(1)]
      }),
      ['', 'TOTAL', '', total.toFixed(2), '', '100.0'],
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `portfolio_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Portfolio Allocation</h2>
          <p className="text-slate-400 text-sm mt-0.5">Adjust sliders to customize weights</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium border border-slate-700 hover:border-emerald-500/50 px-3 py-1.5 rounded-lg"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/50 text-slate-500 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Live Price</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Allocated</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Shares</th>
              <th className="px-4 py-3 text-left w-48">Weight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {stocks.map((s, i) => {
              const color = TICKER_COLORS[i % TICKER_COLORS.length]
              const w = weights[s.ticker] ?? (100 / stocks.length)
              const alloc = total * (w / 100)
              const shares = alloc / s.price
              return (
                <tr key={s.ticker} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${color.dot} flex-shrink-0 shadow-sm`} />
                      <div>
                        <div className="font-bold text-white">{s.ticker}</div>
                        <div className="text-slate-500 text-xs truncate max-w-[120px]">{s.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300 whitespace-nowrap">
                    ${s.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300 whitespace-nowrap">
                    ${alloc.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400 whitespace-nowrap">
                    {shares.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 w-48">
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={1}
                        max={99}
                        value={w}
                        onChange={e => handleSlider(s.ticker, Number(e.target.value))}
                        className="flex-1 min-w-0 h-1.5 rounded-full cursor-pointer"
                        style={{ accentColor: color.accent }}
                      />
                      <span className="w-12 text-right font-mono text-slate-400 text-xs flex-shrink-0">{w.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot className="bg-slate-900/50">
            <tr>
              <td colSpan={2} className="px-4 py-3 font-semibold text-slate-400">Total</td>
              <td className="px-4 py-3 text-right font-bold text-white font-mono">
                ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
              <td />
              <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                {totalWeight.toFixed(1)}% allocated
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
