import type { NewsItem } from '../api/client'

interface Props {
  news: Record<string, NewsItem[]> | null
  tickers: string[]
}

export default function NewsFeed({ news, tickers }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Latest News</h2>
        <p className="text-slate-400 text-sm mt-0.5">Recent headlines for your selected stocks</p>
      </div>
      <div className="divide-y divide-slate-100">
        {tickers.map(ticker => {
          const items = news?.[ticker] || []
          if (!items.length) return null
          return (
            <div key={ticker} className="px-6 py-4">
              <p className="font-bold text-blue-600 text-sm mb-2">{ticker}</p>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i}>
                    <a
                      href={item.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 text-sm hover:text-blue-600 transition-colors line-clamp-2"
                    >
                      {item.title}
                    </a>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {item.publisher}{item.published ? ` · ${item.published.slice(0, 10)}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
        {!news && (
          <div className="px-6 py-4 text-slate-400 text-sm">Loading news...</div>
        )}
      </div>
    </div>
  )
}
