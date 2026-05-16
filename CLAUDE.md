# Stock Portfolio Suggestion Engine — Agent Onboarding

## What This Project Is
A full-stack web app (CMPE 285 term project) that recommends a stock/ETF portfolio based on a user's investment amount and chosen strategy. Built with **FastAPI (Python) + React (TypeScript)**.

---

## How to Run

```bash
# Terminal 1 — Backend (from project root)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Runs at http://localhost:8000

# Terminal 2 — Frontend (from project root)
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

---

## Project Structure

```
project/
├── backend/
│   ├── main.py                  # FastAPI app + CORS config
│   ├── requirements.txt
│   ├── routes/
│   │   ├── portfolio.py         # POST /api/portfolio
│   │   ├── history.py           # GET  /api/history
│   │   ├── news.py              # GET  /api/news
│   │   ├── risk.py              # GET  /api/risk
│   │   └── compare.py           # GET  /api/compare
│   └── services/
│       ├── stock_service.py     # yfinance wrapper + strategy→ticker map
│       ├── allocation.py        # equal-split and custom-weight logic
│       └── risk_calc.py         # volatility-based risk scoring
├── frontend/
│   └── src/
│       ├── App.tsx              # Main app shell, routing between screens
│       ├── index.css            # TailwindCSS import
│       ├── api/
│       │   └── client.ts        # axios API calls + shared TypeScript types
│       ├── services/
│       │   └── history.ts       # localStorage read/write for past portfolios
│       └── components/
│           ├── AmountInput.tsx      # Dollar input with $5k minimum validation
│           ├── StrategyPicker.tsx   # Strategy checkboxes (max 2 selectable)
│           ├── AllocationTable.tsx  # Stock list + live-adjustable weight sliders
│           ├── PortfolioChart.tsx   # 5-day portfolio trend (Recharts LineChart)
│           ├── ComparisonChart.tsx  # All-5-strategy comparison (Recharts LineChart)
│           ├── RiskBadge.tsx        # Low/Medium/High risk badge + per-stock breakdown
│           ├── NewsFeed.tsx         # yfinance news headlines per ticker
│           └── PastPortfolios.tsx   # Sidebar showing localStorage history
├── req1.png                     # Original project requirements (page 1)
├── req2.png                     # Original project requirements (page 2)
└── CLAUDE.md                    # This file
```

---

## Architecture

```
Browser (React)
    │  HTTP via axios
    ▼
FastAPI backend (Python / Uvicorn)
    │  yfinance calls
    ▼
Yahoo Finance API (no API key needed)
```

- **No database.** All stock data is fetched live on each request.
- **User history** is stored in browser `localStorage` (no login, no backend storage).
- The backend is **stateless**.

---

## API Endpoints

### `POST /api/portfolio`
Generate a portfolio recommendation.

**Request body:**
```json
{ "amount": 10000, "strategies": ["Ethical", "Growth"] }
```
- `amount` must be ≥ 5000
- `strategies` is 1 or 2 items from: `Ethical`, `Growth`, `Index`, `Quality`, `Value`

**Response:**
```json
{
  "stocks": [
    { "ticker": "AAPL", "name": "Apple Inc.", "price": 182.50, "allocation": 1666.67, "shares": 9.1324, "weight": 16.67 }
  ],
  "total": 10000,
  "strategies": ["Ethical", "Growth"]
}
```

---

### `GET /api/history?tickers=AAPL,TSLA`
Returns 5-day close price history per ticker and a combined portfolio trend.

**Response:**
```json
{
  "perTicker": { "AAPL": [{ "date": "2026-05-13", "close": 181.0 }] },
  "portfolioTrend": [{ "date": "2026-05-13", "value": 182.5 }]
}
```

---

### `GET /api/risk?tickers=AAPL,TSLA`
Calculates risk based on 5-day return standard deviation.
- `< 0.01` → Low, `< 0.025` → Medium, else → High

**Response:**
```json
{ "overall": "Medium", "breakdown": { "AAPL": "Low", "TSLA": "High" } }
```

---

### `GET /api/news?tickers=AAPL,TSLA`
Returns up to 3 recent news headlines per ticker via yfinance.

**Response:**
```json
{ "AAPL": [{ "title": "...", "publisher": "...", "link": "...", "published": "..." }] }
```

---

### `GET /api/compare?amount=10000`
Simulates 5-day portfolio value for all 5 strategies at the given amount.

**Response:**
```json
{ "Ethical": [{ "date": "2026-05-13", "value": 10050.0 }], "Growth": [...] }
```

---

## Strategy → Ticker Mappings

Defined in `backend/services/stock_service.py`:

| Strategy | Tickers |
|---|---|
| Ethical | AAPL, ADBE, NSRGY |
| Growth | TSLA, NVDA, AMZN |
| Index | VTI, IXUS, ILTB |
| Quality | MSFT, JNJ, PG |
| Value | BRK-B, JPM, XOM |

Each strategy maps to exactly 3 stocks/ETFs. When 2 strategies are selected, their ticker lists are combined (deduplicated).

---

## Frontend User Flow

1. **Input screen** — user enters amount + selects 1 or 2 strategies → clicks "Generate Portfolio"
2. App calls `POST /api/portfolio`, then fires 4 parallel calls: `/history`, `/risk`, `/news`, `/compare`
3. **Results screen** shows:
   - Summary banner (amount, strategies, stock count)
   - `AllocationTable` — stock list with adjustable weight sliders (recalculates allocation client-side, no extra API call)
   - `PortfolioChart` — 5-day trend scaled to user's actual investment amount
   - `RiskBadge` — overall + per-stock risk level
   - `ComparisonChart` — what $X would be worth across all 5 strategies
   - `NewsFeed` — recent headlines per selected stock
4. Each calculation is saved to `localStorage`. A "Past Portfolios" sidebar on the input screen lets users reload previous inputs.

---

## Key Design Decisions

| Decision | Choice | Why |
|---|---|---|
| Stock data source | yfinance | Free, no API key, works for academic projects |
| Allocation default | Equal split | Simple, transparent, easy to explain |
| User can adjust weights | Yes, via sliders | More interactive; recalculated client-side |
| Database | None | Requirements don't need persistence; localStorage is enough |
| Dual strategy handling | Combine ticker pools | Straightforward, pool is deduplicated |
| Risk scoring | Std dev of 5-day returns | Simple, uses already-fetched data |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.x, FastAPI, Uvicorn |
| Stock Data | yfinance |
| Frontend | React 18, TypeScript, Vite |
| Styling | TailwindCSS v4 (via `@tailwindcss/vite` plugin) |
| Charts | Recharts |
| HTTP client | axios |
| History | browser `localStorage` |

---

## Known Limitations / Future Work

- **Market closed hours:** yfinance may return stale or missing data on weekends/holidays. The app doesn't currently warn the user.
- **Bundle size:** The production bundle is ~600 kB (mostly Recharts). Can be improved with dynamic imports if needed.
- **CORS:** Backend currently allows only `http://localhost:5173`. Update `allow_origins` in `backend/main.py` for any deployment.
- **No authentication:** History is per-browser only.
- **News:** Some tickers (e.g. ETFs like VTI, ILTB) may return empty news arrays — this is expected, yfinance doesn't always have news for ETFs.
