const PRESETS = [5000, 10000, 25000, 50000]

interface Props {
  value: number
  onChange: (v: number) => void
  error?: string
}

export default function AmountInput({ value, onChange, error }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-300">
        Investment Amount (USD)
      </label>
      <div className="flex gap-2 flex-wrap">
        {PRESETS.map(p => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150
              ${value === p
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/25'
                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-indigo-500/60 hover:text-indigo-300 hover:bg-indigo-900/20'
              }`}
          >
            ${p.toLocaleString()}
          </button>
        ))}
      </div>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-medium select-none">$</span>
        <input
          type="number"
          min={5000}
          step={100}
          value={value || ''}
          onChange={e => onChange(Number(e.target.value))}
          placeholder="Minimum $5,000"
          className="w-full pl-8 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
        />
      </div>
      {error && <p className="text-rose-400 text-sm">{error}</p>}
      <p className="text-slate-600 text-xs">Minimum investment: $5,000 USD</p>
    </div>
  )
}
