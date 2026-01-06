import json
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.parser import parse_excel_file
from app.models.schemas import StandardizedReport

router = APIRouter()

@router.post("/upload", response_model=StandardizedReport)
async def upload_financial_report(file: UploadFile = File(...)):
    """
    Uploads a file (Excel or JSON) and returns a normalized, CAS-aligned JSON structure.
    """
    filename = file.filename.lower()
    
    if not filename.endswith(('.xlsx', '.xls', '.json')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload .xlsx, .xls, or .json")
    
    content = await file.read()

    try:
        if filename.endswith('.json'):
            # Parse and validate JSON directly
            json_data = json.loads(content)
            # This validates the structure against our Pydantic model
            report = StandardizedReport(**json_data)
            return report
        else:
            # Parse Excel
            report = parse_excel_file(content, file.filename)
            return report
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file content.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing error: {str(e)}")
