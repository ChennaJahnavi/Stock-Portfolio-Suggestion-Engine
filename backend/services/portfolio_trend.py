from services.stock_service import get_five_day_history


def build_portfolio_trend(amount: float, tickers: list[str]) -> list[dict]:
    """Simulate equal-dollar portfolio value over 5 days (same logic as /api/compare)."""
    if not tickers or amount <= 0:
        return []

    per_stock = amount / len(tickers)
    date_totals: dict[str, float] = {}

    for ticker in tickers:
        history = get_five_day_history(ticker)
        if not history:
            continue
        base_price = history[0]["close"]
        if base_price == 0:
            continue
        shares = per_stock / base_price
        for day in history:
            d = day["date"]
            date_totals[d] = date_totals.get(d, 0.0) + shares * day["close"]

    return [
        {"date": d, "value": round(v, 2)}
        for d, v in sorted(date_totals.items())
    ]
