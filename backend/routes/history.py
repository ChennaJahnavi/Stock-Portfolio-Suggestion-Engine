from fastapi import APIRouter, Query
from services.stock_service import get_five_day_history
from services.portfolio_trend import build_portfolio_trend

router = APIRouter()


@router.get("/history")
def get_history(
    tickers: str = Query(..., description="Comma-separated ticker symbols"),
    amount: float = Query(10000, description="Investment amount used to simulate portfolio value"),
):
    ticker_list = [t.strip() for t in tickers.split(",") if t.strip()]
    per_ticker = {t: get_five_day_history(t) for t in ticker_list}
    portfolio_trend = build_portfolio_trend(amount, ticker_list)

    return {"perTicker": per_ticker, "portfolioTrend": portfolio_trend}
