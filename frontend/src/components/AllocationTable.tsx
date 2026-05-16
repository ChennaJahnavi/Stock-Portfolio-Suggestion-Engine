import { useState, useEffect } from 'react'
import type { StockItem } from '../api/client'

interface Props {
  stocks: StockItem[]
  total: number
}

export default function AllocationTable({ stocks, total }: Props) {
  const [weights, setWeights] = useState<Record<string, number>>({})

  useEffect(() => {
    const even = 100 / stocks.length
    setWeights(Object.fromEntries(stocks.map(s => [s.ticker, Math.round(even * 10) / 10]))
    )
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Portfolio Allocation</h2>
        <p className="text-slate-400 text-sm mt-0.5">Adjust sliders to customize weights</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-right">Live Price</th>
              <th className="px-6 py-3 text-right">Allocated</th>
              <th className="px-6 py-3 text-right">Shares</th>
              <th className="px-6 py-3 text-left min-w-[180px]">Weight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stocks.map(s => {
              const w = weights[s.ticker] ?? (100 / stocks.length)
              const alloc = total * (w / 100)
              const shares = alloc / s.price
              return (
                <tr key={s.ticker} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{s.ticker}</div>
                    <div className="text-slate-400 text-xs">{s.name}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700">
                    ${s.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700">
                    ${alloc.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700">
                    {shares.toFixed(4)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={1}
                        max={99}
                        value={w}
                        onChange={e => handleSlider(s.ticker, Number(e.target.value))}
                        className="flex-1 accent-blue-500"
                      />
                      <span className="w-12 text-right font-mono text-slate-600 text-xs">{w.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot className="bg-slate-50">
            <tr>
              <td colSpan={2} className="px-6 py-3 font-semibold text-slate-700">Total</td>
              <td className="px-6 py-3 text-right font-bold text-slate-800 font-mono">
                ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
              <td />
              <td className="px-6 py-3 text-xs text-slate-400 font-mono">
                {totalWeight.toFixed(1)}% allocated
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
