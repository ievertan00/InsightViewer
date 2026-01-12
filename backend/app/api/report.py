from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.models.llm_schemas import AnalysisContext, ReportRequest, GeneratedReport
from app.services.llm_service import LLMService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class GenerateReportPayload(BaseModel):
    context: AnalysisContext
    options: ReportRequest

@router.post("/report/generate", response_model=GeneratedReport)
async def generate_report_endpoint(payload: GenerateReportPayload):
    """
    Generates a financial analysis report using the specified LLM provider.
    """
    try:
        service = LLMService()
        
        # Validate provider
        if payload.options.model_provider not in ["gemini", "deepseek", "qwen"]:
            raise HTTPException(status_code=400, detail="Invalid model provider. Choose 'gemini', 'deepseek', or 'qwen'.")

        report = await service.generate_report(
            context=payload.context,
            profile=payload.options.report_profile,
            provider=payload.options.model_provider
        )
        
        if "Error" in report.full_markdown and report.sections == []:
             # Log the error for debugging
             logger.error(f"Report generation failed: {report.full_markdown}")
             # Return 500 so frontend catches it
             raise HTTPException(status_code=500, detail=report.full_markdown)

        return report
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in generate_report_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")