import asyncio
import os
import json
from dotenv import load_dotenv
from app.models.llm_schemas import AnalysisContext, MetricTrend, ActiveFlag
from app.flows.financial_analysis import financial_analysis_flow

# Load environment variables
load_dotenv()

async def test_flow():
    print("🚀 Starting Genkit Flow Test: Triangle of Truth")
    
    # 1. Mock Analysis Context
    context = AnalysisContext(
        company_name="Test Corp (Tech)",
        stock_code="TEST.US",
        fiscal_year="2024",
        period_type="Annual",
        language="English",
        full_report={
            "Income Statement": {
                "Revenue": 1000000,
                "Cost of Revenue": 400000,
                "Gross Profit": 600000,
                "Operating Expenses": 300000,
                "Net Income": 250000
            },
            "Balance Sheet": {
                "Total Assets": 5000000,
                "Total Liabilities": 2000000,
                "Total Equity": 3000000
            }
        },
        ratios={
            "Gross Margin": 0.6,
            "Net Margin": 0.25,
            "Debt to Equity": 0.67
        },
        trends=[
            MetricTrend(
                metric_name="Revenue",
                current_value=1000000,
                previous_value=800000,
                yoy_change_percent=25.0,
                trend_direction="increasing"
            )
        ],
        active_flags=[
            ActiveFlag(
                flag_name="High Growth",
                flag_type="Green",
                severity="Positive",
                triggered_value="25%",
                threshold=">15%",
                description="Revenue grew significantly YoY"
            )
        ],
        missing_data=[]
    )

    try:
        # 2. Run the Flow
        print("📡 Executing Flow (this calls Analyst -> Auditor -> Strategist)...")
        report = await financial_analysis_flow(context)
        
        # 3. Print Results
        print("\n✅ Flow Completed Successfully!")
        print(f"Title: {report.title}")
        print(f"Model: {report.model_used}")
        print(f"Profile: {report.profile_used}")
        print("\n--- Verification Notes ---")
        for note in report.verification_notes or []:
            print(f"- {note}")
            
        print("\n--- Strategic Report Preview ---")
        # Print first 500 chars of the report
        print(report.full_markdown[:1000] + "...")
        
    except Exception as e:
        print(f"❌ Flow Failed: {str(e)}")

if __name__ == "__main__":
    # Ensure GEMINI_API_KEY is present
    if not os.getenv("GEMINI_API_KEY"):
        print("⚠️  Error: GEMINI_API_KEY not found in .env")
    else:
        asyncio.run(test_flow())
