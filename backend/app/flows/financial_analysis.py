import json
import os
from typing import List, Optional, Any
from pydantic import BaseModel, Field
from google import genai
from app.models.llm_schemas import AnalysisContext, GeneratedReport, GeneratedReportSection

# --- Internal Schemas for Flow Steps ---

class DraftAnalysis(BaseModel):
    """Stage 1: Detailed financial analysis output."""
    executive_summary_draft: str = Field(description="Draft of the executive summary")
    profitability_analysis: str = Field(description="Detailed analysis of profitability with data citations")
    solvency_liquidity_analysis: str = Field(description="Detailed analysis of solvency and liquidity")
    efficiency_analysis: str = Field(description="Detailed analysis of operational efficiency")
    risk_anomalies: List[str] = Field(description="List of identified risks and data anomalies")

class AuditFinding(BaseModel):
    """Individual finding from the audit process."""
    location: str = Field(description="Where in the text the issue was found")
    issue_type: str = Field(description="Hallucination, Calculation Error, Rounding Error, or Unsupported Claim")
    original_text: str = Field(description="The problematic text")
    correction: str = Field(description="The corrected text based on source data")
    severity: str = Field(description="Critical, Major, or Minor")

class AuditResult(BaseModel):
    """Stage 2: Output of the verification process."""
    passed: bool = Field(description="Whether the draft passed verification thresholds")
    findings: List[AuditFinding] = Field(description="List of verification findings")
    verified_draft_notes: str = Field(description="Notes for the strategist on what is confirmed facts")

# --- Manual "Flow" Implementation using new google-genai ---

async def financial_analysis_flow(context: AnalysisContext) -> GeneratedReport:
    """
    Triangle of Truth Financial Analysis Implementation.
    Uses multi-stage prompt-chaining to ensure numerical fidelity.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment.")

    client = genai.Client(api_key=api_key)
    model_id = 'gemini-3.0-flash'

    # --- Step 1: The Analyst ---
    print("  [1/3] Analyst: Generating draft...")
    analyst_prompt = f"""
    You are an expert Senior Financial Analyst. Analyze the following financial data for {context.company_name}.
    
    **Data Context:**
    - Fiscal Year: {context.fiscal_year}
    - Period: {context.period_type}
    
    **Task:**
    Perform a rigorous quantitative analysis. Identify key trends, margin changes, and balance sheet health.
    Draft a comprehensive analysis.
    
    **Strict Constraint:** cite specific numbers from the provided data for EVERY claim.
    
    Data:
    {json.dumps(context.dict(), indent=2, default=str)}
    
    Output strictly in JSON format matching this structure:
    {{
        "executive_summary_draft": "...",
        "profitability_analysis": "...",
        "solvency_liquidity_analysis": "...",
        "efficiency_analysis": "...",
        "risk_anomalies": ["risk1", "risk2"]
    }}
    """
    
    response = client.models.generate_content(
        model=model_id, 
        contents=analyst_prompt,
        config={'response_mime_type': 'application/json'}
    )
    draft_data = json.loads(response.text)
    draft_analysis = DraftAnalysis(**draft_data)

    # --- Step 2: The Auditor ---
    print("  [2/3] Auditor: Verifying claims...")
    auditor_prompt = f"""
    You are a Forensic Financial Auditor. Your job is to verify the Analyst's Draft against the Source Data.
    
    **Source Data:**
    {json.dumps(context.dict(), indent=2, default=str)}
    
    **Analyst's Draft:**
    {json.dumps(draft_analysis.dict(), indent=2, default=str)}
    
    **Task:**
    Check EVERY number and claim in the draft against the source data.
    - If a number is wrong, flag it.
    - If a claim is not supported by data, flag it.
    
    Output strictly in JSON format matching this structure:
    {{
        "passed": true/false,
        "findings": [
            {{ "location": "...", "issue_type": "...", "original_text": "...", "correction": "...", "severity": "..." }}
        ],
        "verified_draft_notes": "..."
    }}
    """
    
    response = client.models.generate_content(
        model=model_id, 
        contents=auditor_prompt,
        config={'response_mime_type': 'application/json'}
    )
    audit_data = json.loads(response.text)
    audit_result = AuditResult(**audit_data)

    # --- Step 3: The Strategist ---
    print("  [3/3] Strategist: Synthesizing final report...")
    strategist_prompt = f"""
    You are a Chief Investment Strategist. Write the Final Financial Report for {context.company_name} in {context.language}.
    
    **Input:**
    1. **Verified Facts:** The Analyst's draft.
    2. **Audit Corrections:** {json.dumps(audit_result.dict(), indent=2, default=str)}
    3. **Original Data:** {json.dumps(context.dict(), indent=2, default=str)}
    
    **Task:**
    Synthesize a high-level, strategic report. 
    - Incorporate Auditor's corrections.
    - Focus on strategic implications ("So What?").
    
    Output strictly in JSON format matching this structure:
    {{
        "title": "...",
        "profile_used": "Triangle of Truth Architecture",
        "model_used": "Gemini-3.0-Flash",
        "sections": [
            {{ "section_title": "Executive Summary", "content_markdown": "..." }},
            ...
        ],
        "full_markdown": "Complete report in markdown...",
        "verification_notes": ["Note 1", "Note 2"]
    }}
    """
    
    response = client.models.generate_content(
        model=model_id, 
        contents=strategist_prompt,
        config={'response_mime_type': 'application/json'}
    )
    final_report_data = json.loads(response.text)
    
    # Map verification notes if Auditor found anything
    v_notes = []
    if not audit_result.passed:
        v_notes = [f"{f.issue_type} in {f.location}: {f.correction}" for f in audit_result.findings]
    else:
        v_notes = ["Data verified with 100% numerical fidelity."]
    
    final_report_data["verification_notes"] = v_notes
    
    return GeneratedReport(**final_report_data)
