from fastapi import APIRouter, Query
from services.stock_service import STRATEGY_STOCKS
from services.portfolio_trend import build_portfolio_trend

router = APIRouter()


@router.get("/compare")
def compare_strategies(amount: float = Query(10000, description="Investment amount in USD")):
    return {
        strategy: build_portfolio_trend(amount, tickers)
        for strategy, tickers in STRATEGY_STOCKS.items()
    }
