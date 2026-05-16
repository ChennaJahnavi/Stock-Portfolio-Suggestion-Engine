interface Props {
  value: number
  onChange: (v: number) => void
  error?: string
}

export default function AmountInput({ value, onChange, error }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-slate-700">
        Investment Amount (USD)
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
        <input
          type="number"
          min={5000}
          step={100}
          value={value || ''}
          onChange={e => onChange(Number(e.target.value))}
          placeholder="Minimum $5,000"
          className="w-full pl-7 pr-4 py-3 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <p className="text-slate-400 text-xs">Minimum investment: $5,000 USD</p>
    </div>
  )
}
