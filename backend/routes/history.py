from fastapi import APIRouter, Query
from services.stock_service import get_five_day_history

router = APIRouter()


@router.get("/history")
def get_history(tickers: str = Query(..., description="Comma-separated ticker symbols")):
    ticker_list = [t.strip() for t in tickers.split(",") if t.strip()]
    per_ticker = {t: get_five_day_history(t) for t in ticker_list}

    # Build portfolio daily total (equal weight assumed)
    dates: dict[str, float] = {}
    count = len(ticker_list)
    for ticker, days in per_ticker.items():
        for day in days:
            d = day["date"]
            dates[d] = dates.get(d, 0.0) + day["close"]

    portfolio_trend = [
        {"date": d, "value": round(total / count, 2)}
        for d, total in sorted(dates.items())
    ]

    return {"perTicker": per_ticker, "portfolioTrend": portfolio_trend}
