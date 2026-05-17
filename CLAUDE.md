# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

A full-stack web app (CMPE 285 term project) that recommends a stock/ETF portfolio based on a user's investment amount and chosen strategy. Built with **FastAPI (Python) + React (TypeScript)**.

---

## Commands

```bash
# Backend (from Stock-Portfolio-Suggestion-Engine/backend/)
pip install -r requirements.txt
uvicorn main:app --reload          # http://localhost:8000

# Frontend (from Stock-Portfolio-Suggestion-Engine/frontend/)
npm install
npm run dev                        # http://localhost:5173
npm run build                      # tsc + vite build
npm run lint                       # eslint
npm run preview                    # preview production build
```

No test suite exists in this project.

---

## Architecture

```
Browser (React + Recharts)
    │  axios → http://localhost:8000/api
    ▼
FastAPI (Python / Uvicorn)
    │  yfinance calls
    ▼
Yahoo Finance (no API key required)
```

- **No database.** All stock data is fetched live on each request; backend is stateless.
- **User history** is stored in browser `localStorage` only — no backend persistence.
- All shared TypeScript types and axios wrappers live in `frontend/src/api/client.ts`.

---

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/portfolio` | Generate allocation; body: `{ amount: number (≥5000), strategies: string[] (1–2) }` |
| GET | `/api/history?tickers=A,B` | 5-day close price history + combined portfolio trend |
| GET | `/api/risk?tickers=A,B` | Risk scoring (std dev of 5-day returns: <0.01→Low, <0.025→Medium, else→High) |
| GET | `/api/news?tickers=A,B` | Up to 3 recent headlines per ticker via yfinance |
| GET | `/api/compare?amount=N` | Simulate all 5 strategies over 5 days at given amount |

---

## Strategy → Ticker Mappings

Defined in `backend/services/stock_service.py`. Fixed set — not user-configurable.

| Strategy | Tickers |
|----------|---------|
| Ethical  | AAPL, ADBE, NSRGY |
| Growth   | TSLA, NVDA, AMZN |
| Index    | VTI, IXUS, ILTB |
| Quality  | MSFT, JNJ, PG |
| Value    | BRK-B, JPM, XOM |

When 2 strategies are selected, ticker lists are combined and deduplicated.

---

## Frontend User Flow

1. **Input screen** — amount + 1–2 strategies → "Generate Portfolio"
2. `POST /api/portfolio` fires, then 4 parallel calls: `/history`, `/risk`, `/news`, `/compare`
3. **Results screen** shows allocation table with live-adjustable weight sliders (recalculated client-side, no extra API call), 5-day portfolio trend chart, risk badge, all-strategy comparison chart, and news feed.
4. Each result is saved to `localStorage`; a "Past Portfolios" sidebar lets users reload previous inputs.

---

## Key Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Stock data source | yfinance | Free, no API key |
| Default allocation | Equal split | Simple and transparent |
| Weight adjustments | Client-side sliders | Interactive without extra API calls |
| Persistence | `localStorage` only | Requirements don't need server-side storage |
| Risk scoring | Std dev of 5-day returns | Reuses already-fetched history data |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.x, FastAPI, Uvicorn |
| Stock data | yfinance, pandas |
| Frontend | React 19, TypeScript, Vite |
| Styling | TailwindCSS v4 (`@tailwindcss/vite` plugin — no `tailwind.config.js` needed) |
| Charts | Recharts |
| HTTP client | axios |

---

## Known Limitations

- **CORS:** Backend allows only `http://localhost:5173`. Update `allow_origins` in `backend/main.py` for any deployment.
- **Market hours:** yfinance may return stale/missing data on weekends and holidays — no user warning currently shown.
- **ETF news:** ETFs (VTI, ILTB, IXUS) often return empty news arrays from yfinance — this is expected.
- **Bundle size:** ~600 kB production bundle (mostly Recharts).
