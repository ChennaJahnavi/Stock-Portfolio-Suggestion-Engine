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

const DEFAULT_AMOUNT = 10000

export default function App() {
  const [screen, setScreen] = useState<Screen>('input')
  const [amount, setAmount] = useState<number>(DEFAULT_AMOUNT)
  const [strategies, setStrategies] = useState<string[]>([])
  const [errors, setErrors] = useState<{ amount?: string; strategies?: string }>({})
  const [loading, setLoading] = useState(false)

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
    setAmount(DEFAULT_AMOUNT)
    setStrategies([])
    setErrors({})
    setLoading(false)
    setPortfolio(null)
    setHistory(null)
    setRisk(null)
    setNews(null)
    setCompare(null)
  }

  return (
    <div
      className="min-h-screen relative"
      style={{ background: 'radial-gradient(ellipse at 15% 10%, #1e1b4b 0%, #0f172a 45%, #020617 100%)' }}
    >
      {/* Dot grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.12) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Header */}
      <header className="relative z-20 border-b border-slate-700/50 bg-slate-900/70 backdrop-blur-md shadow-xl">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-xl">
              📈
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent leading-tight">
                Portfolio Suggestion Engine
              </h1>
              <p className="text-slate-500 text-xs">CMPE 285 · Stock Investment Tool</p>
            </div>
          </div>
          {screen === 'results' && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-all duration-150 hover:gap-2.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              New Portfolio
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {screen === 'input' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Build Your Portfolio</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Enter your investment amount and choose up to 2 strategies.
                  </p>
                </div>
                <AmountInput value={amount} onChange={setAmount} error={errors.amount} />
                <StrategyPicker selected={strategies} onChange={setStrategies} error={errors.strategies} />
                <button
                  onClick={generate}
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl font-bold text-base text-white transition-all duration-200 flex items-center justify-center gap-2
                    ${loading
                      ? 'bg-indigo-900/60 cursor-wait'
                      : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.99]'
                    }`}
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Generating Portfolio...
                    </>
                  ) : (
                    <>
                      Generate Portfolio
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <PastPortfolios onReload={reloadRecord} />
              <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-indigo-300 font-semibold text-sm mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  How it works
                </p>
                <ul className="text-slate-400 text-xs space-y-1.5">
                  {[
                    'Enter your investment amount ($5k min)',
                    'Pick 1 or 2 investing strategies',
                    'Get a live portfolio with real prices',
                    'Adjust allocation with sliders',
                    'Review risk, news, and trend charts',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-400 font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          portfolio && (
            <div className="space-y-6">
              {/* Summary banner */}
              <div className="bg-gradient-to-r from-indigo-900/80 to-blue-900/80 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 shadow-2xl">
                <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-3">Portfolio Summary</p>
                <div className="flex flex-wrap gap-8">
                  <div>
                    <p className="text-slate-400 text-xs mb-0.5">Investment</p>
                    <p className="text-3xl font-bold text-white">${portfolio.total.toLocaleString()}</p>
                  </div>
                  <div className="w-px bg-indigo-700/40 hidden sm:block" />
                  <div>
                    <p className="text-slate-400 text-xs mb-0.5">Strategies</p>
                    <p className="text-3xl font-bold text-white">{portfolio.strategies.join(' + ')}</p>
                  </div>
                  <div className="w-px bg-indigo-700/40 hidden sm:block" />
                  <div>
                    <p className="text-slate-400 text-xs mb-0.5">Stocks / ETFs</p>
                    <p className="text-3xl font-bold text-white">{portfolio.stocks.length}</p>
                  </div>
                </div>
              </div>

              <AllocationTable stocks={portfolio.stocks} total={portfolio.total} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PortfolioChart data={history?.portfolioTrend ?? []} total={portfolio.total} />
                <RiskBadge risk={risk} />
              </div>

              <ComparisonChart data={compare} amount={portfolio.total} />
              <NewsFeed news={news} tickers={portfolio.stocks.map(s => s.ticker)} />
            </div>
          )
        )}
      </main>
    </div>
  )
}
