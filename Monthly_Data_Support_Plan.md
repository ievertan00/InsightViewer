# Plan: Support for Monthly Financial Data

## 1. Backend: Intelligent Parsing (Priority High)
**File:** `backend/app/services/parser.py`

*   **Objective:** Detect and parse monthly date formats in Excel headers (e.g., `2023-01`, `202301`, `2023年1月`).
*   **Tasks:**
    1.  Update `find_header_row` regex to support ISO (`YYYY-MM`), compact (`YYYYMM`), and Chinese (`YYYY年MM月`) date formats.
    2.  Refine `years_map` extraction to store the full period string (e.g., "2023-01") instead of just the year.
    3.  In `parse_excel_file`, add logic to determine `period_type`:
        *   If pattern matches `YYYY-MM` or `YYYY01` -> Set `period_type = "Monthly"`.
        *   If pattern matches `Q1-Q4` -> Set `period_type = "Quarterly"`.
        *   Default to `"Annual"`.

## 2. Frontend: Time-Series Handling
**File:** `frontend/src/lib/chartDataMapper.ts`

*   **Objective:** Ensure charts sort and display monthly data linearly.
*   **Tasks:**
    1.  Verify `fiscal_year` sorting logic handles "YYYY-MM" strings correctly (Standard ASCII sort works for ISO dates).
    2.  Update `mapProfitabilityTrends` and `mapGrowthIndicators`:
        *   Ensure growth calculations (MoM vs YoY) are clear. For MVP, relying on the sorted order (Sequential/MoM) is easiest, but labeling it clearly is key.

## 3. Frontend: Logic Engine Adaptation
**File:** `frontend/src/lib/flagsEngine.ts`

*   **Objective:** Adjust financial ratios for shorter periods.
*   **Tasks:**
    1.  **Annualization:** When `period_type` is "Monthly", flow metrics (Revenue, COGS, Profit) are 1/12th of annual scale.
        *   *Turnover Ratios (Inventory/AR):* Multiply monthly COGS/Revenue by 12 before dividing by Average Assets.
        *   *Margins (%):* No change needed (ratio of two flows).
    2.  **Comparison Context:**
        *   Update `prev` selection logic. For monthly data, a MoM comparison (Latest vs Latest-1) is standard for "Trends", but YoY (Latest vs Latest-12) is better for "Seasonality".
        *   *Decision:* Keep `curr` vs `prev` (Sequential) for now to track immediate deterioration, but add a note or flag for Annualization.

## 4. Frontend: UI Filters
**Files:** `frontend/src/app/charts/page.tsx`, `frontend/src/app/ratios/page.tsx`

*   **Objective:** Reduce visual clutter.
*   **Tasks:**
    1.  Update the "Annual Only" toggle to a 3-way selector or dropdown: `["Annual", "Quarterly", "Monthly", "All"]`.
    2.  Filter displayed reports based on this selection before mapping data.

---
**Next Step:** Implement Step 1 (Backend Parser Update).
