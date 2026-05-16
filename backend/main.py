from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import portfolio, history, news, risk, compare

app = FastAPI(title="Stock Portfolio Suggestion Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portfolio.router, prefix="/api")
app.include_router(history.router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(risk.router, prefix="/api")
app.include_router(compare.router, prefix="/api")
