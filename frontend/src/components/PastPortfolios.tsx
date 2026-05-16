import { loadHistory, clearHistory, type PortfolioRecord } from '../services/history'
import { useState } from 'react'

interface Props {
  onReload: (record: PortfolioRecord) => void
}

export default function PastPortfolios({ onReload }: Props) {
  const [history, setHistory] = useState<PortfolioRecord[]>(loadHistory)

  const handleClear = () => {
    clearHistory()
    setHistory([])
  }

  if (!history.length) return null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Past Portfolios</h2>
        <button onClick={handleClear} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
          Clear history
        </button>
      </div>
      <ul className="divide-y divide-slate-100">
        {history.map(r => (
          <li key={r.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div>
              <p className="text-sm font-semibold text-slate-700">{r.strategies.join(' + ')}</p>
              <p className="text-xs text-slate-400">
                ${r.amount.toLocaleString()} · {r.date}
              </p>
            </div>
            <button
              onClick={() => onReload(r)}
              className="text-xs text-blue-500 hover:text-blue-700 font-semibold transition-colors"
            >
              Reload
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
