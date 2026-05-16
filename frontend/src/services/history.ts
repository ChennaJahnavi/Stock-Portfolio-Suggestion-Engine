export interface PortfolioRecord {
  id: string
  date: string
  amount: number
  strategies: string[]
  tickers: string[]
  totalValue: number
}

const KEY = 'portfolio_history'

export function loadHistory(): PortfolioRecord[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveRecord(record: Omit<PortfolioRecord, 'id' | 'date'>): void {
  const history = loadHistory()
  history.unshift({
    ...record,
    id: crypto.randomUUID(),
    date: new Date().toLocaleDateString(),
  })
  localStorage.setItem(KEY, JSON.stringify(history.slice(0, 20)))
}

export function clearHistory(): void {
  localStorage.removeItem(KEY)
}
