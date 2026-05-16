from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.stock_service import (
    get_tickers_for_strategies,
    get_live_price,
    COMPANY_NAMES,
)
from services.allocation import equal_split

router = APIRouter()


class PortfolioRequest(BaseModel):
    amount: float
    strategies: list[str]


@router.post("/portfolio")
def get_portfolio(req: PortfolioRequest):
    if req.amount < 5000:
        raise HTTPException(status_code=400, detail="Minimum investment is $5,000 USD.")
    if not req.strategies or len(req.strategies) > 2:
        raise HTTPException(status_code=400, detail="Select 1 or 2 strategies.")

    tickers = get_tickers_for_strategies(req.strategies)
    allocation = equal_split(req.amount, tickers)

    stocks = []
    for ticker in tickers:
        price = get_live_price(ticker)
        if price is None:
            continue
        alloc = allocation[ticker]
        shares = alloc / price
        stocks.append({
            "ticker": ticker,
            "name": COMPANY_NAMES.get(ticker, ticker),
            "price": round(price, 2),
            "allocation": round(alloc, 2),
            "shares": round(shares, 4),
            "weight": round(100 / len(tickers), 2),
        })

    return {
        "stocks": stocks,
        "total": req.amount,
        "strategies": req.strategies,
    }
