from fastapi import APIRouter, Query
from services.stock_service import STRATEGY_STOCKS, get_five_day_history

router = APIRouter()


@router.get("/compare")
def compare_strategies(amount: float = Query(10000, description="Investment amount in USD")):
    result: dict[str, list[dict]] = {}

    for strategy, tickers in STRATEGY_STOCKS.items():
        per_stock = amount / len(tickers)
        date_totals: dict[str, float] = {}

        for ticker in tickers:
            history = get_five_day_history(ticker)
            if not history:
                continue
            # Normalise: how many shares would $per_stock buy at day-0 price?
            base_price = history[0]["close"]
            if base_price == 0:
                continue
            shares = per_stock / base_price
            for day in history:
                d = day["date"]
                date_totals[d] = date_totals.get(d, 0.0) + shares * day["close"]

        result[strategy] = [
            {"date": d, "value": round(v, 2)}
            for d, v in sorted(date_totals.items())
        ]

    return result
