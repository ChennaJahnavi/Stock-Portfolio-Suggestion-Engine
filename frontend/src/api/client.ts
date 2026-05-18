import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000/api' })

export interface StockItem {
  ticker: string
  name: string
  price: number
  allocation: number
  shares: number
  weight: number
}

export interface PortfolioResponse {
  stocks: StockItem[]
  total: number
  strategies: string[]
}

export interface DayValue {
  date: string
  value: number
}

export interface HistoryResponse {
  perTicker: Record<string, { date: string; close: number }[]>
  portfolioTrend: DayValue[]
}

export interface NewsItem {
  title: string
  publisher: string
  link: string
  published: string
}

export interface RiskResponse {
  overall: string
  breakdown: Record<string, string>
}

export const fetchPortfolio = (amount: number, strategies: string[]) =>
  api.post<PortfolioResponse>('/portfolio', { amount, strategies }).then(r => r.data)

export const fetchHistory = (tickers: string[], amount: number) =>
  api.get<HistoryResponse>('/history', {
    params: { tickers: tickers.join(','), amount },
  }).then(r => r.data)

export const fetchNews = (tickers: string[]) =>
  api.get<Record<string, NewsItem[]>>('/news', { params: { tickers: tickers.join(',') } }).then(r => r.data)

export const fetchRisk = (tickers: string[]) =>
  api.get<RiskResponse>('/risk', { params: { tickers: tickers.join(',') } }).then(r => r.data)

export const fetchCompare = (amount: number) =>
  api.get<Record<string, DayValue[]>>('/compare', { params: { amount } }).then(r => r.data)
