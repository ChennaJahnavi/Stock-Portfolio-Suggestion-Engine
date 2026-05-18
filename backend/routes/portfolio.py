from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.stock_service import (
    get_tickers_for_strategies,
    get_live_price,
    COMPANY_NAMES,
    STRATEGY_STOCKS,
)
from services.allocation import equal_split, custom_split

router = APIRouter()


class PortfolioRequest(BaseModel):
    amount: float
    strategies: list[str]
    strategy_weights: Optional[dict[str, float]] = None


@router.post("/portfolio")
def get_portfolio(req: PortfolioRequest):
    if req.amount < 5000:
        raise HTTPException(status_code=400, detail="Minimum investment is $5,000 USD.")
    if not req.strategies or len(req.strategies) > 2:
        raise HTTPException(status_code=400, detail="Select 1 or 2 strategies.")

    tickers = get_tickers_for_strategies(req.strategies)

    # Build allocation and per-ticker weights
    if req.strategy_weights and len(req.strategies) == 2:
        ticker_weights: dict[str, float] = {}
        for strategy in req.strategies:
            s_tickers = STRATEGY_STOCKS.get(strategy, [])
            w_per_ticker = req.strategy_weights.get(strategy, 50) / len(s_tickers)
            for t in s_tickers:
                if t not in ticker_weights:
                    ticker_weights[t] = w_per_ticker
        allocation = custom_split(req.amount, ticker_weights)
        weight_map = ticker_weights
    else:
        allocation = equal_split(req.amount, tickers)
        weight_map = {t: 100 / len(tickers) for t in tickers}

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
            "weight": round(weight_map[ticker], 2),
        })

    return {
        "stocks": stocks,
        "total": req.amount,
        "strategies": req.strategies,
    }
