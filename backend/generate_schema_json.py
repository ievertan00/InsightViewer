from app.models.schemas import StandardizedReport, Report, FinancialReportData, IncomeStatement, BalanceSheet, CashFlowStatement
import json

# Create a fully populated instance to show structure
report = StandardizedReport(
    reports=[
        Report(
            fiscal_year="2023 Annual",
            period_type="Annual",
            data=FinancialReportData(
                income_statement=IncomeStatement(),
                balance_sheet=BalanceSheet(),
                cash_flow_statement=CashFlowStatement()
            )
        )
    ]
)

print(report.model_dump_json(indent=2))
