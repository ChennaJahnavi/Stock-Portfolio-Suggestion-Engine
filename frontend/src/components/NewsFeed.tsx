import type { NewsItem } from '../api/client'

interface Props {
  news: Record<string, NewsItem[]> | null
  tickers: string[]
}

export default function NewsFeed({ news, tickers }: Props) {
  const hasAny = news && tickers.some(t => (news[t] || []).length > 0)

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Latest News</h2>
        <p className="text-slate-400 text-sm mt-0.5">Recent headlines for your selected stocks</p>
      </div>
      <div className="divide-y divide-slate-700/30">
        {tickers.map(ticker => {
          const items = news?.[ticker] || []
          if (!items.length) return null
          return (
            <div key={ticker} className="px-6 py-4">
              <p className="font-bold text-indigo-400 text-sm mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-indigo-500 inline-block flex-shrink-0" />
                {ticker}
              </p>
              <ul className="space-y-3">
                {items.map((item, i) => (
                  <li key={i} className="group">
                    <a
                      href={item.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-slate-300 text-sm hover:text-white transition-colors"
                    >
                      <span className="flex-1 line-clamp-2 group-hover:underline underline-offset-2">
                        {item.title}
                      </span>
                      <svg className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 flex-shrink-0 mt-0.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <p className="text-slate-600 text-xs mt-1">
                      {item.publisher}{item.published ? ` · ${item.published.slice(0, 10)}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
        {!hasAny && (
          <div className="px-6 py-8 text-center">
            {!news ? (
              <div className="flex justify-center mb-2"><span className="spinner" /></div>
            ) : (
              <svg className="w-8 h-8 text-slate-700 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            )}
            <p className="text-slate-500 text-sm">
              {news ? 'No news available for these tickers.' : 'Loading news...'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
