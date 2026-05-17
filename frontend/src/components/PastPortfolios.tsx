import { loadHistory, clearHistory, type PortfolioRecord } from '../services/history'
import { useState } from 'react'

interface Props {
  onReload: (record: PortfolioRecord) => void
}

const STRATEGY_COLORS: Record<string, string> = {
  Ethical: 'bg-emerald-400',
  Growth:  'bg-sky-400',
  Index:   'bg-violet-400',
  Quality: 'bg-amber-400',
  Value:   'bg-rose-400',
}

export default function PastPortfolios({ onReload }: Props) {
  const [history, setHistory] = useState<PortfolioRecord[]>(loadHistory)

  const handleClear = () => {
    clearHistory()
    setHistory([])
  }

  if (!history.length) return null

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-700/50 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Past Portfolios</h2>
        <button
          onClick={handleClear}
          className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
        >
          Clear history
        </button>
      </div>
      <ul className="divide-y divide-slate-700/30">
        {history.map(r => (
          <li
            key={r.id}
            className="px-5 py-3 flex items-center justify-between hover:bg-slate-700/20 transition-colors group cursor-pointer"
            onClick={() => onReload(r)}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1">
                {r.strategies.map(s => (
                  <div key={s} className={`w-2 h-2 rounded-full ${STRATEGY_COLORS[s] ?? 'bg-slate-500'}`} />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">{r.strategies.join(' + ')}</p>
                <p className="text-xs text-slate-500">${r.amount.toLocaleString()} · {r.date}</p>
              </div>
            </div>
            <span className="text-xs text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Load →
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
