import os
from fastapi import APIRouter, HTTPException, Query
from app.services.tushare_client import TushareClient
from app.models.schemas import StandardizedReport

router = APIRouter()

@router.get("/stock/{symbol}", response_model=StandardizedReport)
async def get_stock_financials(
    symbol: str, 
    start_date: str = Query(None, description="Start date (YYYYMMDD)"),
    end_date: str = Query(None, description="End date (YYYYMMDD)")
):
    """
    Fetches financial data for a given stock symbol (e.g., 600519.SH) from Tushare.
    Requires TUSHARE_TOKEN env var to be set.
    """
    token = os.getenv("TUSHARE_TOKEN")
    if not token:
        raise HTTPException(status_code=500, detail="TUSHARE_TOKEN not configured on server.")
        
    try:
        client = TushareClient(token)
        report = client.fetch_financial_data(symbol, start_date, end_date)
        return report
    except Exception as e:
        # Log error here in production
        raise HTTPException(status_code=500, detail=f"Tushare Error: {str(e)}")
