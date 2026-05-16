def equal_split(amount: float, tickers: list[str]) -> dict[str, float]:
    per_stock = amount / len(tickers)
    return {t: per_stock for t in tickers}


def custom_split(amount: float, weights: dict[str, float]) -> dict[str, float]:
    """weights values should sum to 100."""
    total_weight = sum(weights.values())
    return {t: amount * (w / total_weight) for t, w in weights.items()}
