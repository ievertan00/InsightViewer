from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- LLM Input Context Models ---

class MetricTrend(BaseModel):
    metric_name: str
    current_value: float
    previous_value: Optional[float]
    yoy_change_percent: Optional[float]
    trend_direction: str  # "increasing", "decreasing", "stable"

class ActiveFlag(BaseModel):
    flag_name: str
    flag_type: str  # "Red", "Green"
    severity: str  # "Critical", "Warning", "Positive"
    triggered_value: str
    threshold: str
    description: str

class AnalysisContext(BaseModel):
    """
    The strict context window object fed to the LLM.
    Minimizes tokens while maximizing signal.
    """
    company_name: str
    stock_code: str
    fiscal_year: str
    period_type: str
    language: str
    
    # Complete Data Context
    full_report: Dict[str, Any]
    ratios: Dict[str, Any]
    
    # Computed Trends
    trends: List[MetricTrend]
    
    # Active Signals
    active_flags: List[ActiveFlag]
    
    # Missing Data Constraints
    missing_data: List[str]

# --- Report Generation Request/Response ---

class ReportRequest(BaseModel):
    report_profile: str = Field("senior_financial_specialist", description="Fixed profile: senior_financial_specialist")
    model_provider: str = Field("gemini", description="gemini | deepseek | qwen")
    include_reasoning: bool = True

class GeneratedReportSection(BaseModel):
    section_title: str
    content_markdown: str

class GeneratedReport(BaseModel):
    title: str
    profile_used: str
    model_used: str
    sections: List[GeneratedReportSection]
    full_markdown: str
    verification_notes: Optional[List[str]] = None
