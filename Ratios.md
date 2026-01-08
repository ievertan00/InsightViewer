# Ratios

Here is the comprehensive list of financial ratios from the Tushare `fina_indicator` data, classified by category with formulas in both English and Chinese.

- **Profitability & Margins (盈利能力)**

  - `grossprofit_margin` — **Gross Margin % / 销售毛利率**
    - Formula (En): (Revenue - Cost of Goods Sold) / Revenue
    - Formula (Cn): (营业收入 - 营业成本) / 营业收入
  - `netprofit_margin` — **Net Profit Margin % / 销售净利率**
    - Formula (En): Net Income / Revenue
    - Formula (Cn): 净利润 / 营业收入
  - `cogs_of_sales` — **Cost of Sales Ratio % / 销售成本率**
    - Formula (En): Cost of Goods Sold / Revenue
    - Formula (Cn): 营业成本 / 营业收入
  - `expense_of_sales` — **Selling Expense Ratio % / 销售期间费用率**
    - Formula (En): (Selling Exp + Admin Exp + Finance Exp) / Revenue
    - Formula (Cn): (销售费用 + 管理费用 + 财务费用) / 营业收入
  - `ebit_of_gr` — **EBIT Margin % / 息税前利润率**
    - Formula (En): EBIT / Total Revenue
    - Formula (Cn): 息税前利润 / 营业总收入
  - `op_of_gr` — **Operating Margin % / 营业利润率**
    - Formula (En): Operating Income / Total Revenue
    - Formula (Cn): 营业利润 / 营业总收入
  - `impai_ttm` — **Asset Impairment Ratio / 资产减值损失率**
    - Formula (En): Asset Impairment Loss / Total Revenue
    - Formula (Cn): 资产减值损失 / 营业总收入

- **Return on Investment (回报率)**

  - `roe` — **Return on Equity (ROE)  %/ 净资产收益率**
    - Formula (En): Net Income / Average Shareholders' Equity
    - Formula (Cn): 净利润 / 平均股东权益
  - `roa` — **Return on Assets (ROA) %/ 总资产报酬率**
    - Formula (En): Net Income / Average Total Assets
    - Formula (Cn): 净利润 / 平均资产总额
  - `roic` — **Return on Invested Capital (ROIC) %/ 投入资本回报率**
    - Formula (En): EBIT * (1 - Tax Rate) / Invested Capital
    - Formula (Cn): 息税前利润 * (1 - 税率) / 投入资本
  - `cfroi` — **Cash Flow Return on Investment (CFROI) % / 现金流投资回报率**
    - Formula (En): (Operating Cash Flow - Economic Depreciation) / Gross Invested Capital
    - Formula (Cn): (经营活动产生的现金流量净额 - 经济折旧) / 总投入资本
  - `croic` — **Cash Return on Net Invested Capital (CROIC)  %/ 现金投入资本回报率**
    - Formula (En): Free Cash Flow / (Shareholders' Equity + Interest Bearing Debt)
    - Formula (Cn): 自由现金流 / (股东权益 + 带息债务)

- **Solvency & Liquidity (偿债能力)**

  - `current_ratio` — **Current Ratio / 流动比率**

    - Formula (En): Current Assets / Current Liabilities
    - Formula (Cn): 流动资产 / 流动负债

  - `quick_ratio` — **Quick Ratio / 速动比率**

    - Formula (En): (Current Assets - Inventory) / Current Liabilities
    - Formula (Cn): (流动资产 - 存货) / 流动负债

  - `cash_ratio` — **Cash Ratio / 现金比率**

    - Formula (En): (Cash + Cash Equivalents) / Current Liabilities
    - Formula (Cn): (货币资金 + 现金等价物) / 流动负债

  - `debt_to_assets` — **Debt to Asset Ratio % / 资产负债率**

    - Formula (En): Total Liabilities / Total Assets
    - Formula (Cn): 负债总额 / 资产总额

  - `debt_to_eqt` — **Debt to Equity Ratio / 产权比率**

    - Formula (En): Total Liabilities / Shareholders' Equity
    - Formula (Cn): 负债总额 / 股东权益

  - `ebit_to_interest` — **Interest Coverage Ratio / 已获利息倍数**

    - Formula (En): EBIT / Interest Expense
    - Formula (Cn): 息税前利润 / 利息费用

  - `ocf_ratio` — **Operating Cash Flow Ratio / 经营现金流比率**

    - Formula (En): Operating Cash Flow / Current Liabilities
    - Formula (Cn): 经营活动产生的现金流量净额 / 流动负债

  - `nwc_to_assets` — **Net Working Capital to Total Assets Ratio / 营运资金占总资产比率**

    - Formula (En): (Current Assets - Current Liabilities) / Total Assets

    - Formula (Cn): (流动资产 - 流动负债) / 资产总额

  - `netdebt` — **Net Debt / 净债务**

    - Formula (En): Interest Bearing Debt - Cash & Equivalents
    - Formula (Cn): 带息债务 - 货币资金

- **Operating Efficiency (营运能力)**

  - `saleexp_to_gr` — **Selling Expense Ratio / 销售费用率**

    - Formula (En): Selling Expenses / Revenue * 100%
    - Formula (Cn): 销售费用 / 营业收入 * 100%

  - `adminexp_of_gr` — **Administrative Expense Ratio / 管理费用率**

    - Formula (En): Administrative Expenses / Revenue * 100%
    - Formula (Cn): 管理费用 / 营业收入 * 100%

  - `rd_exp_ratio` — **R&D Expense Ratio / 研发费用率**

    - Formula (En): R&D Expenses / Revenue * 100%

    - Formula (Cn): 研发费用 / 营业收入 * 100%

  - `invturn_days` — **Days Inventory Outstanding (DIO) / 存货周转天数**
    - Formula (En): 365 / Inventory Turnover Ratio
    - Formula (Cn): 365 / 存货周转率
  - `arturn_days` — **Days Sales Outstanding (DSO) / 应收账款周转天数**
    - Formula (En): 365 / Accounts Receivable Turnover Ratio
    - Formula (Cn): 365 / 应收账款周转率
  - `inv_turn` — **Inventory Turnover / 存货周转率**
    - Formula (En): Cost of Goods Sold / Average Inventory
    - Formula (Cn): 营业成本 / 平均存货
  - `ar_turn` — **Accounts Receivable Turnover / 应收账款周转率**
    - Formula (En): Revenue / Average Accounts Receivable
    - Formula (Cn): 营业收入 / 平均应收账款
  - `assets_turn` — **Total Asset Turnover / 总资产周转率**
    - Formula (En): Revenue / Average Total Assets
    - Formula (Cn): 营业收入 / 平均资产总额
  - `turn_days` — **Operating Cycle / 营业周期**
    - Formula (En): Inventory Days + AR Days
    - Formula (Cn): 存货周转天数 + 应收账款周转天数
  - `working_capital` — **Working Capital / 营运资金**
    - Formula (En): Current Assets - Current Liabilities
    - Formula (Cn): 流动资产 - 流动负债

**Cash Flow Quality (现金流质量)**

- `ocf_to_or` — **OCF to Revenue Ratio / 经营现金流与收入比**
  - Formula (En): Operating Cash Flow / Revenue
  - Formula (Cn): 经营活动产生的现金流量净额 / 营业收入
- `ocf_to_opincome` — **OCF to Operating Income / 盈利现金比率**
  - Formula (En): Operating Cash Flow / Operating Income
  - Formula (Cn): 经营活动产生的现金流量净额 / 营业利润
- `fcff` — **Free Cash Flow to Firm (FCFF) / 企业自由现金流量**
  - Formula (En): Net Income + D&A + Interest * (1 - Tax) - Capex - Change in Working Capital
  - Formula (Cn): 净利润 + 折旧摊销 + 利息 * (1 - 税率) - 资本开支 - 营运资本变动
- `salescash_to_or` — **Cash Collection Ratio / 收现比**
  - Formula (En): Cash Received from Sales / Revenue
  - Formula (Cn): 销售商品提供劳务收到的现金 / 营业收入
- `ocf_to_debt` — **OCF to Debt Ratio / 经营现金流与负债比**
  - Formula (En): Operating Cash Flow / Total Liabilities
  - Formula (Cn): 经营活动产生的现金流量净额 / 负债合计
- `ocf_to_capex` — **Operating Cash Flow to Capital Expenditures / 经营现金流与资本支出比**
  - Formula (En): Operating Cash Flow / Capital Expenditures
  - Formula (Cn): 经营活动产生的现金流量净额 / 资本支出

- **Growth Indicators (成长性)**
  - `tr_yoy` — **Total Revenue Growth / 营业总收入增长率**
    - Formula (En): (Current Revenue - Previous Revenue) / Previous Revenue
    - Formula (Cn): (本期营业总收入 - 上期营业总收入) / 上期营业总收入
  - `netprofit_yoy` — **Net Profit Growth / 净利润增长率**
    - Formula (En): (Current Net Income - Previous Net Income) / |Previous Net Income|
    - Formula (Cn): (本期净利润 - 上期净利润) / |上期净利润|
  - `ocf_yoy` — **OCF Growth / 经营现金流增长率**
    - Formula (En): (Current OCF - Previous OCF) / |Previous OCF|
    - Formula (Cn): (本期经营现金流 - 上期经营现金流) / |上期经营现金流|