from fastapi import APIRouter, Query
from services.risk_calc import calculate_risk

router = APIRouter()


@router.get("/risk")
def get_risk(tickers: str = Query(..., description="Comma-separated ticker symbols")):
    ticker_list = [t.strip() for t in tickers.split(",") if t.strip()]
    return calculate_risk(ticker_list)
