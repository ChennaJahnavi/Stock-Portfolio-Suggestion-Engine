const STRATEGIES = [
  {
    id: 'Ethical', label: 'Ethical Investing', icon: '🌱', desc: 'AAPL · ADBE · NSRGY',
    activeClasses: 'border-emerald-500 bg-emerald-500/10 shadow-emerald-500/20',
    iconBg: 'bg-emerald-500/20',
    checkBg: 'bg-emerald-500',
    labelColor: 'text-emerald-400',
  },
  {
    id: 'Growth', label: 'Growth Investing', icon: '📈', desc: 'TSLA · NVDA · AMZN',
    activeClasses: 'border-sky-500 bg-sky-500/10 shadow-sky-500/20',
    iconBg: 'bg-sky-500/20',
    checkBg: 'bg-sky-500',
    labelColor: 'text-sky-400',
  },
  {
    id: 'Index', label: 'Index Investing', icon: '📊', desc: 'VTI · IXUS · ILTB',
    activeClasses: 'border-violet-500 bg-violet-500/10 shadow-violet-500/20',
    iconBg: 'bg-violet-500/20',
    checkBg: 'bg-violet-500',
    labelColor: 'text-violet-400',
  },
  {
    id: 'Quality', label: 'Quality Investing', icon: '💎', desc: 'MSFT · JNJ · PG',
    activeClasses: 'border-amber-500 bg-amber-500/10 shadow-amber-500/20',
    iconBg: 'bg-amber-500/20',
    checkBg: 'bg-amber-500',
    labelColor: 'text-amber-400',
  },
  {
    id: 'Value', label: 'Value Investing', icon: '💰', desc: 'BRK-B · JPM · XOM',
    activeClasses: 'border-rose-500 bg-rose-500/10 shadow-rose-500/20',
    iconBg: 'bg-rose-500/20',
    checkBg: 'bg-rose-500',
    labelColor: 'text-rose-400',
  },
]

interface Props {
  selected: string[]
  onChange: (s: string[]) => void
  error?: string
  split: number
  onSplitChange: (v: number) => void
  amount: number
}

export default function StrategyPicker({ selected, onChange, error, split, onSplitChange, amount }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id))
    } else if (selected.length < 2) {
      onChange([...selected, id])
    }
  }

  const showSplit = selected.length === 2
  const s0 = STRATEGIES.find(s => s.id === selected[0])
  const s1 = STRATEGIES.find(s => s.id === selected[1])
  const alloc0 = amount * (split / 100)
  const alloc1 = amount * ((100 - split) / 100)

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-300">
        Investment Strategy <span className="font-normal text-slate-500">(pick 1 or 2)</span>
      </label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {STRATEGIES.map(s => {
          const active = selected.includes(s.id)
          const disabled = !active && selected.length >= 2
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              disabled={disabled}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200
                ${active
                  ? `${s.activeClasses} shadow-lg`
                  : 'border-slate-700 bg-slate-900/40 hover:border-slate-500 hover:bg-slate-700/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-slate-900/50'
                }
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${s.iconBg}`}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${active ? s.labelColor : 'text-slate-200'}`}>
                  {s.label}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">{s.desc}</p>
              </div>
              {active && (
                <div className={`w-5 h-5 rounded-full ${s.checkBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {showSplit && s0 && s1 && (
        <div className="mt-2 bg-slate-900/50 border border-slate-700 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Strategy Split</p>
          <div className="flex items-center justify-between text-sm">
            <span className={`font-semibold ${s0.labelColor}`}>{s0.label} — {split}%</span>
            <span className={`font-semibold ${s1.labelColor}`}>{100 - split}% — {s1.label}</span>
          </div>
          <input
            type="range"
            min={10}
            max={90}
            value={split}
            onChange={e => onSplitChange(Number(e.target.value))}
            className="w-full h-1.5 rounded-full cursor-pointer"
            style={{ accentColor: '#6366f1' }}
          />
          {amount >= 5000 && (
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>${alloc0.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              <span>${alloc1.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-rose-400 text-sm">{error}</p>}
    </div>
  )
}
