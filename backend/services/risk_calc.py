import pandas as pd
import yfinance as yf


def _volatility(ticker: str) -> float:
    try:
        hist = yf.Ticker(ticker).history(period="5d")
        if hist.empty or len(hist) < 2:
            return 0.0
        returns = hist["Close"].pct_change().dropna()
        return float(returns.std())
    except Exception:
        return 0.0


def _score(vol: float) -> str:
    if vol < 0.01:
        return "Low"
    if vol < 0.025:
        return "Medium"
    return "High"


RISK_ORDER = {"Low": 0, "Medium": 1, "High": 2}


def calculate_risk(tickers: list[str]) -> dict:
    breakdown: dict[str, str] = {}
    for t in tickers:
        breakdown[t] = _score(_volatility(t))

    overall = max(breakdown.values(), key=lambda s: RISK_ORDER[s])
    return {"overall": overall, "breakdown": breakdown}
