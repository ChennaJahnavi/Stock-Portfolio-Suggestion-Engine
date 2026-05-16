import yfinance as yf
from typing import Optional

STRATEGY_STOCKS: dict[str, list[str]] = {
    "Ethical": ["AAPL", "ADBE", "NSRGY"],
    "Growth":  ["TSLA", "NVDA", "AMZN"],
    "Index":   ["VTI",  "IXUS", "ILTB"],
    "Quality": ["MSFT", "JNJ",  "PG"],
    "Value":   ["BRK-B", "JPM", "XOM"],
}

COMPANY_NAMES: dict[str, str] = {
    "AAPL":  "Apple Inc.",
    "ADBE":  "Adobe Inc.",
    "NSRGY": "Nestlé S.A.",
    "TSLA":  "Tesla Inc.",
    "NVDA":  "NVIDIA Corp.",
    "AMZN":  "Amazon.com Inc.",
    "VTI":   "Vanguard Total Stock Market ETF",
    "IXUS":  "iShares Core MSCI Total Intl Stk ETF",
    "ILTB":  "iShares Core 10+ Year USD Bond ETF",
    "MSFT":  "Microsoft Corp.",
    "JNJ":   "Johnson & Johnson",
    "PG":    "Procter & Gamble Co.",
    "BRK-B": "Berkshire Hathaway Inc.",
    "JPM":   "JPMorgan Chase & Co.",
    "XOM":   "Exxon Mobil Corp.",
}


def get_tickers_for_strategies(strategies: list[str]) -> list[str]:
    seen: set[str] = set()
    tickers: list[str] = []
    for s in strategies:
        for t in STRATEGY_STOCKS.get(s, []):
            if t not in seen:
                seen.add(t)
                tickers.append(t)
    return tickers


def get_live_price(ticker: str) -> Optional[float]:
    try:
        t = yf.Ticker(ticker)
        info = t.fast_info
        price = getattr(info, "last_price", None)
        if price is None:
            hist = t.history(period="1d")
            if not hist.empty:
                price = float(hist["Close"].iloc[-1])
        return float(price) if price else None
    except Exception:
        return None


def get_five_day_history(ticker: str) -> list[dict]:
    try:
        hist = yf.Ticker(ticker).history(period="5d")
        result = []
        for date, row in hist.iterrows():
            result.append({
                "date": date.strftime("%Y-%m-%d"),
                "close": round(float(row["Close"]), 2),
            })
        return result
    except Exception:
        return []


def get_news(ticker: str) -> list[dict]:
    try:
        raw = yf.Ticker(ticker).news or []
        out = []
        for item in raw[:3]:
            content = item.get("content", {})
            title = content.get("title") or item.get("title", "")
            provider = content.get("provider", {})
            publisher = provider.get("displayName") if isinstance(provider, dict) else item.get("publisher", "")
            canonical = content.get("canonicalUrl", {})
            link = canonical.get("url") if isinstance(canonical, dict) else item.get("link", "")
            pub_date = content.get("pubDate") or item.get("providerPublishTime", "")
            if title:
                out.append({
                    "title": title,
                    "publisher": publisher or "",
                    "link": link or "",
                    "published": str(pub_date),
                })
        return out
    except Exception:
        return []
