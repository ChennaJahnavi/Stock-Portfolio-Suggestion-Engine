const STRATEGIES = [
  { id: 'Ethical',  label: 'Ethical Investing',  icon: '🌱', desc: 'AAPL · ADBE · NSRGY' },
  { id: 'Growth',   label: 'Growth Investing',   icon: '📈', desc: 'TSLA · NVDA · AMZN' },
  { id: 'Index',    label: 'Index Investing',    icon: '📊', desc: 'VTI · IXUS · ILTB' },
  { id: 'Quality',  label: 'Quality Investing',  icon: '💎', desc: 'MSFT · JNJ · PG' },
  { id: 'Value',    label: 'Value Investing',    icon: '💰', desc: 'BRK-B · JPM · XOM' },
]

interface Props {
  selected: string[]
  onChange: (s: string[]) => void
  error?: string
}

export default function StrategyPicker({ selected, onChange, error }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id))
    } else if (selected.length < 2) {
      onChange([...selected, id])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700">
        Investment Strategy <span className="font-normal text-slate-400">(pick 1 or 2)</span>
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
              className={`flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all
                ${active ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{s.label}</p>
                <p className="text-slate-400 text-xs mt-0.5">{s.desc}</p>
              </div>
              {active && (
                <span className="ml-auto text-blue-500 font-bold text-lg leading-none">✓</span>
              )}
            </button>
          )
        })}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
