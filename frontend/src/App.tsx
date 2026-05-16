import { useState } from 'react'
import './index.css'
import AmountInput from './components/AmountInput'
import StrategyPicker from './components/StrategyPicker'
import AllocationTable from './components/AllocationTable'
import PortfolioChart from './components/PortfolioChart'
import RiskBadge from './components/RiskBadge'
import NewsFeed from './components/NewsFeed'
import ComparisonChart from './components/ComparisonChart'
import PastPortfolios from './components/PastPortfolios'
import {
  fetchPortfolio, fetchHistory, fetchNews, fetchRisk, fetchCompare,
  type PortfolioResponse, type HistoryResponse, type RiskResponse, type NewsItem, type DayValue,
} from './api/client'
import { saveRecord, type PortfolioRecord } from './services/history'

type Screen = 'input' | 'results'

export default function App() {
  const [screen, setScreen] = useState<Screen>('input')
  const [amount, setAmount] = useState<number>(10000)
  const [strategies, setStrategies] = useState<string[]>([])
  const [errors, setErrors] = useState<{ amount?: string; strategies?: string }>({})
  const [loading, setLoading] = useState(false)

  // Results state
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null)
  const [history, setHistory] = useState<HistoryResponse | null>(null)
  const [risk, setRisk] = useState<RiskResponse | null>(null)
  const [news, setNews] = useState<Record<string, NewsItem[]> | null>(null)
  const [compare, setCompare] = useState<Record<string, DayValue[]> | null>(null)

  const validate = () => {
    const e: typeof errors = {}
    if (!amount || amount < 5000) e.amount = 'Minimum investment is $5,000 USD.'
    if (!strategies.length) e.strategies = 'Please select at least one strategy.'
    setErrors(e)
    return !Object.keys(e).length
  }

  const generate = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const p = await fetchPortfolio(amount, strategies)
      setPortfolio(p)
      setScreen('results')
      const tickers = p.stocks.map(s => s.ticker)
      saveRecord({ amount, strategies, tickers, totalValue: amount })
      // Fire parallel requests for extra data
      const [h, r, n, c] = await Promise.all([
        fetchHistory(tickers),
        fetchRisk(tickers),
        fetchNews(tickers),
        fetchCompare(amount),
      ])
      setHistory(h)
      setRisk(r)
      setNews(n)
      setCompare(c)
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Something went wrong. Please try again.'
      setErrors({ amount: msg })
    } finally {
      setLoading(false)
    }
  }

  const reloadRecord = (record: PortfolioRecord) => {
    setAmount(record.amount)
    setStrategies(record.strategies)
  }

  const reset = () => {
    setScreen('input')
    setPortfolio(null)
    setHistory(null)
    setRisk(null)
    setNews(null)
    setCompare(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">Portfolio Suggestion Engine</h1>
              <p className="text-slate-400 text-xs">CMPE 285 · Stock Investment Tool</p>
            </div>
          </div>
          {screen === 'results' && (
            <button
              onClick={reset}
              className="text-sm text-blue-500 hover:text-blue-700 font-semibold transition-colors"
            >
              ← New Portfolio
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {screen === 'input' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Build Your Portfolio</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Enter your investment amount and choose up to 2 strategies.
                  </p>
                </div>
                <AmountInput value={amount} onChange={setAmount} error={errors.amount} />
                <StrategyPicker selected={strategies} onChange={setStrategies} error={errors.strategies} />
                <button
                  onClick={generate}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg transition-colors text-base"
                >
                  {loading ? 'Generating Portfolio...' : 'Generate Portfolio →'}
                </button>
              </div>
            </div>

            {/* Past Portfolios Sidebar */}
            <div className="space-y-4">
              <PastPortfolios onReload={reloadRecord} />
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-700 font-semibold text-sm mb-1">How it works</p>
                <ul className="text-blue-600 text-xs space-y-1">
                  <li>1. Enter your investment amount ($5k min)</li>
                  <li>2. Pick 1 or 2 investing strategies</li>
                  <li>3. Get a live portfolio with real prices</li>
                  <li>4. Adjust allocation with sliders</li>
                  <li>5. Review risk, news, and trend charts</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          portfolio && (
            <div className="space-y-6">
              {/* Summary banner */}
              <div className="bg-blue-600 text-white rounded-xl p-5 flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-blue-200 text-sm">Investment</p>
                  <p className="text-2xl font-bold">${portfolio.total.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Strategies</p>
                  <p className="text-2xl font-bold">{portfolio.strategies.join(' + ')}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Stocks / ETFs</p>
                  <p className="text-2xl font-bold">{portfolio.stocks.length}</p>
                </div>
              </div>

              {/* Allocation table */}
              <AllocationTable stocks={portfolio.stocks} total={portfolio.total} />

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PortfolioChart data={history?.portfolioTrend ?? []} total={portfolio.total} />
                <RiskBadge risk={risk} />
              </div>

              {/* Comparison + News */}
              <ComparisonChart data={compare} amount={portfolio.total} />
              <NewsFeed news={news} tickers={portfolio.stocks.map(s => s.ticker)} />
            </div>
          )
        )}
      </main>
    </div>
  )
}
