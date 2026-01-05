from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.parser import parse_excel_file
from app.models.schemas import StandardizedReport

router = APIRouter()

@router.post("/upload", response_model=StandardizedReport)
async def upload_financial_report(file: UploadFile = File(...)):
    """
    Uploads an Excel file (Profit, Balance, Cash Flow) and returns 
    a normalized, CAS-aligned JSON structure.
    """
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload .xlsx or .xls")
    
    try:
        content = await file.read()
        report = parse_excel_file(content, file.filename)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing error: {str(e)}")
