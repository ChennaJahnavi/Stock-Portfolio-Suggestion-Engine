from fastapi import APIRouter, Query
from services.stock_service import get_news

router = APIRouter()


@router.get("/news")
def get_stock_news(tickers: str = Query(..., description="Comma-separated ticker symbols")):
    ticker_list = [t.strip() for t in tickers.split(",") if t.strip()]
    return {t: get_news(t) for t in ticker_list}
