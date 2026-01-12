from typing import List
import json
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.services.parser import parse_excel_file, merge_standardized_reports
from app.models.schemas import StandardizedReport, CompanyMeta

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/upload", response_model=StandardizedReport)
def upload_financial_report(file: UploadFile = File(...)):
    """
    Uploads a file (Excel or JSON) and returns a normalized, CAS-aligned JSON structure.
    """
    filename = file.filename.lower()

    if not filename.endswith(('.xlsx', '.xls', '.json')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload .xlsx, .xls, or .json")

    try:
        content = file.file.read()
        if filename.endswith('.json'):
            # Parse and validate JSON directly
            json_data = json.loads(content)
            # This validates the structure against our Pydantic model
            report = StandardizedReport(**json_data)
            # Merge internal duplicates by fiscal year
            report = merge_standardized_reports(
                StandardizedReport(company_meta=report.company_meta), 
                report
            )
            return report
        else:
            # Parse Excel
            report = parse_excel_file(content, file.filename)
            return report
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file content.")
    except Exception as e:
        logger.error(f"Upload failed for file {filename}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Parsing error: {str(e)}")


@router.post("/bulk-upload", response_model=StandardizedReport)
async def bulk_upload_financial_reports(files: List[UploadFile] = File(...)):
    """
    Uploads multiple files and merges them into a single StandardizedReport.
    Handles partial successes by collecting warnings.
    """
    aggregated_report = StandardizedReport(
        company_meta=CompanyMeta(name="Unknown"),
        reports=[],
        parsing_warnings=[]
    )

    first_company_name = None

    for file in files:
        filename = file.filename.lower()
        if not filename.endswith(('.xlsx', '.xls', '.json')):
            aggregated_report.parsing_warnings.append(f"Skipped {file.filename}: Invalid file format.")
            continue

        try:
            content = await file.read()
            if filename.endswith('.json'):
                json_data = json.loads(content)
                current_report = StandardizedReport(**json_data)
            else:
                current_report = parse_excel_file(content, file.filename)

            # Check for company name consistency if multiple reports have names
            current_name = current_report.company_meta.name
            if current_name and current_name != "Unknown":
                if not first_company_name:
                    first_company_name = current_name
                    aggregated_report.company_meta.name = current_name
                elif first_company_name != current_name:
                    aggregated_report.parsing_warnings.append(
                        f"Warning for {file.filename}: Company name mismatch ('{current_name}' vs '{first_company_name}'). Data merged anyway."
                    )

            # Merge into aggregated report
            aggregated_report = merge_standardized_reports(aggregated_report, current_report)

        except Exception as e:
            logger.error(f"Bulk upload partial failure for file {file.filename}: {e}", exc_info=True)
            aggregated_report.parsing_warnings.append(f"Error processing {file.filename}: {str(e)}")

    return aggregated_report


@router.post("/merge-reports", response_model=StandardizedReport)
def merge_reports_endpoint(
    existing_reports_json: str = Form(...),
    new_reports_json: str = Form(...)
):
    """
    Merges two StandardizedReport JSON strings by fiscal year.
    """
    try:
        # Parse the JSON strings into StandardizedReport objects
        existing_data = json.loads(existing_reports_json)
        new_data = json.loads(new_reports_json)

        existing_report = StandardizedReport(**existing_data)
        new_report = StandardizedReport(**new_data)

        # Use the merge function from the parser service
        merged_report = merge_standardized_reports(existing_report, new_report)

        return merged_report
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format in one of the inputs.")
    except Exception as e:
        logger.error(f"Merge reports failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Merge error: {str(e)}")