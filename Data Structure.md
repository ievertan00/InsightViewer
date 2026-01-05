# Data Structure

------

### 第一部分：完整中英文键名对照表 (Mapping Table)

#### **1. 利润表 (Income Statement)**

| **层级** | **原始中文项目**                     | **英文 Key (JSON)**                      | **说明**     |
| -------- | ------------------------------------ | ---------------------------------------- | ------------ |
| **L1**   | **一、营业总收入**                   | **`total_operating_revenue`**            | **父级对象** |
| L2       | 营业收入                             | `operating_revenue`                      |              |
| L2       | 利息收入                             | `interest_income`                        |              |
| L2       | 已赚保费                             | `earned_premiums`                        |              |
| L2       | 手续费及佣金收入                     | `fee_and_commission_income`              |              |
| L2       | 其他业务收入                         | `other_business_revenue`                 |              |
| L2       | 营业总收入其他项目                   | `other_items`                            |              |
| **L1**   | **二、营业总成本**                   | **`total_operating_cost`**               | **父级对象** |
| L2       | 营业成本                             | `operating_cost`                         |              |
| L2       | 利息支出                             | `interest_expenses`                      |              |
| L2       | 手续费及佣金支出                     | `fee_and_commission_expenses`            |              |
| L2       | 营业税金及附加                       | `taxes_and_surcharges`                   |              |
| L2       | 销售费用                             | `selling_expenses`                       |              |
| L2       | 管理费用                             | `admin_expenses`                         |              |
| L2       | 研发费用                             | `rd_expenses`                            |              |
| **L2**   | **财务费用**                         | **`financial_expenses`**                 | **子级对象** |
| L3       | 利息费用                             | `interest_expenses`                      |              |
| L3       | 利息收入                             | `interest_income`                        |              |
| L2       | 资产减值损失                         | `asset_impairment_loss`                  |              |
| L2       | 信用减值损失                         | `credit_impairment_loss`                 |              |
| L2       | 退保金                               | `surrender_value`                        |              |
| L2       | 赔付支出净额                         | `net_compensation_expenses`              |              |
| L2       | 提取保险合同准备金净额               | `net_insurance_contract_reserves`        |              |
| L2       | 保单红利支出                         | `policy_dividend_expenses`               |              |
| L2       | 分保费用                             | `reinsurance_expenses`                   |              |
| L2       | 其他业务成本                         | `other_business_costs`                   |              |
| L2       | 营业总成本其他项目                   | `other_items`                            |              |
| **L1**   | **三、其他经营收益**                 | **`other_operating_income`**             | **父级对象** |
| L2       | 公允价值变动收益                     | `fair_value_change_income`               |              |
| L2       | 投资收益                             | `investment_income`                      |              |
| L2       | 对联营企业和合营企业的投资收益       | `investment_income_from_associates_jv`   |              |
| L2       | 净敞口套期收益                       | `net_exposure_hedging_income`            |              |
| L2       | 汇兑收益                             | `exchange_income`                        |              |
| L2       | 资产处置收益                         | `asset_disposal_income`                  |              |
| L2       | 资产减值损失(新)                     | `asset_impairment_loss_new`              |              |
| L2       | 信用减值损失(新)                     | `credit_impairment_loss_new`             |              |
| L2       | 其他收益                             | `other_income`                           |              |
| L2       | 营业利润其他项目                     | `operating_profit_other_items`           |              |
| L2       | 营业利润平衡项目                     | `operating_profit_balance_items`         |              |
| **L1**   | **四、营业利润**                     | **`operating_profit`**                   | **父级对象** |
| L2       | 营业外收入                           | `non_operating_revenue`                  |              |
| L2       | 非流动资产处置利得                   | `non_current_asset_disposal_gain`        |              |
| L2       | 营业外支出                           | `non_operating_expenses`                 |              |
| L2       | 非流动资产处置净损失                 | `non_current_asset_disposal_loss`        |              |
| L2       | 影响利润总额的其他项目               | `other_items_affecting_total_profit`     |              |
| L2       | 利润总额平衡项目                     | `total_profit_balance_items`             |              |
| **L1**   | **五、利润总额**                     | **`total_profit`**                       | **父级对象** |
| L2       | 所得税                               | `income_tax`                             |              |
| L2       | 未确认投资损失                       | `unconfirmed_investment_loss`            |              |
| L2       | 影响净利润的其他项目                 | `other_items_affecting_net_profit`       |              |
| L2       | 净利润差额(合计平衡项目2)            | `net_profit_difference`                  |              |
| **L1**   | **六、净利润**                       | **`net_profit`**                         | **父级对象** |
| L2       | 持续经营净利润                       | `net_profit_continuing_ops`              |              |
| L2       | 终止经营净利润                       | `net_profit_discontinued_ops`            |              |
| L2       | 被合并方在合并前实现利润             | `profit_from_merged_party_before_merger` |              |
| L2       | 归属于母公司股东的净利润             | `net_profit_attr_to_parent`              |              |
| L2       | 少数股东损益                         | `minority_interest_income`               |              |
| L2       | 扣除非经常性损益后的净利润           | `net_profit_deducting_non_recurring`     |              |
| L2       | 净利润其他项目                       | `other_items`                            |              |
| L2       | 净利润差额(合计平衡项目)             | `balance_items`                          |              |
| **L1**   | **七、每股收益**                     | **`earnings_per_share`**                 | **父级对象** |
| L2       | (一) 基本每股收益                    | `basic_eps`                              |              |
| L2       | (二) 稀释每股收益                    | `diluted_eps`                            |              |
| **L1**   | **八、其他综合收益**                 | **`other_comprehensive_income`**         | **父级对象** |
| L2       | 归属于母公司股东的其他综合收益       | `attr_to_parent`                         |              |
| L2       | 归属于少数股东的其他综合收益         | `attr_to_minority`                       |              |
| **L1**   | **九、综合收益总额**                 | **`total_comprehensive_income`**         | **父级对象** |
| L2       | 归属于母公司所有者的综合收益总额     | `attr_to_parent`                         |              |
| L2       | 归属于少数股东的综合收益总额         | `attr_to_minority`                       |              |
| L2       | 以摊余成本计量的金融资产终止确认收益 | `derecognition_income_amortized_cost`    |              |

#### **2. 资产负债表 (Balance Sheet)**

| **层级** | **原始中文项目**                                         | **英文 Key (JSON)**                                | **说明**     |
| -------- | -------------------------------------------------------- | -------------------------------------------------- | ------------ |
| **L1**   | **流动资产**                                             | **`current_assets`**                               | **父级对象** |
| L2       | 货币资金                                                 | `monetary_funds`                                   |              |
| L2       | 结算备付金                                               | `clearing_settlement_funds`                        |              |
| L2       | 融出资金                                                 | `lending_funds`                                    |              |
| L2       | 拆出资金                                                 | `funds_lent`                                       |              |
| L2       | 交易性金融资产                                           | `trading_financial_assets`                         |              |
| **L2**   | **以公允价值计量且其变动计入当期损益的金融资产**         | **`financial_assets_fvpl`**                        | **子级对象** |
| L3       | 其中:交易性金融资产                                      | `trading_financial_assets`                         |              |
| L3       | 其中:指定以公允价值计量且其变动计入当期损益的金融资产    | `designated_financial_assets_fvpl`                 |              |
| L2       | 衍生金融资产                                             | `derivative_financial_assets`                      |              |
| **L2**   | **应收票据及应收账款**                                   | **`notes_and_accounts_receivable`**                | **子级对象** |
| L3       | 应收票据                                                 | `notes_receivable`                                 |              |
| L3       | 应收账款                                                 | `accounts_receivable`                              |              |
| L2       | 应收款项融资                                             | `receivables_financing`                            |              |
| L2       | 预付款项                                                 | `prepayments`                                      |              |
| L2       | 应收保费                                                 | `premiums_receivable`                              |              |
| L2       | 应收分保账款                                             | `reinsurance_accounts_receivable`                  |              |
| L2       | 应收分保合同准备金                                       | `reinsurance_contract_reserves_receivable`         |              |
| **L2**   | **其他应收款合计**                                       | **`other_receivables_total`**                      | **子级对象** |
| L3       | 其中:应收利息                                            | `interest_receivable`                              |              |
| L3       | 其中:应收股利                                            | `dividends_receivable`                             |              |
| L3       | 其中:其他应收款                                          | `other_receivables`                                |              |
| L2       | 应收出口退税                                             | `export_tax_refund_receivable`                     |              |
| L2       | 应收补贴款                                               | `subsidies_receivable`                             |              |
| L2       | 内部应收款                                               | `internal_receivables`                             |              |
| L2       | 买入返售金融资产                                         | `buy_back_financial_assets`                        |              |
| L2       | 以摊余成本计量的金融资产                                 | `financial_assets_amortized_cost`                  |              |
| L2       | 存货                                                     | `inventories`                                      |              |
| L2       | 以公允价值计量且其变动计入其他综合收益的金融资产         | `financial_assets_fvoci`                           |              |
| L2       | 合同资产                                                 | `contract_assets`                                  |              |
| L2       | 划分为持有待售的资产                                     | `assets_held_for_sale`                             |              |
| L2       | 一年内到期的非流动资产                                   | `non_current_assets_due_within_1y`                 |              |
| L2       | 代理业务资产                                             | `agency_business_assets`                           |              |
| L2       | 其他流动资产                                             | `other_current_assets`                             |              |
| L2       | 流动资产其他项目                                         | `other_items`                                      |              |
| L2       | 流动资产平衡项目                                         | `balance_items`                                    |              |
| L2       | **流动资产合计**                                         | **`total_current_assets`**                         |              |
| **L1**   | **非流动资产**                                           | **`non_current_assets`**                           | **父级对象** |
| L2       | 发放贷款及垫款                                           | `loans_and_advances`                               |              |
| L2       | 债权投资                                                 | `debt_investments`                                 |              |
| L2       | 其他债权投资                                             | `other_debt_investments`                           |              |
| L2       | 以摊余成本计量的金融资产(非流动)                         | `financial_assets_amortized_cost_non_current`      |              |
| L2       | 以公允价值计量且其变动计入其他综合收益的金融资产(非流动) | `financial_assets_fvoci_non_current`               |              |
| L2       | 可供出售金融资产                                         | `available_for_sale_financial_assets`              |              |
| L2       | 持有至到期投资                                           | `held_to_maturity_investments`                     |              |
| L2       | 长期应收款                                               | `long_term_receivables`                            |              |
| L2       | 长期股权投资                                             | `long_term_equity_investments`                     |              |
| L2       | 投资性房地产                                             | `investment_properties`                            |              |
| L2       | 固定资产                                                 | `fixed_assets`                                     |              |
| L2       | 在建工程                                                 | `construction_in_progress`                         |              |
| L2       | 工程物资                                                 | `construction_materials`                           |              |
| L2       | 其他权益工具投资                                         | `other_equity_instrument_investments`              |              |
| L2       | 其他非流动金融资产                                       | `other_non_current_financial_assets`               |              |
| L2       | 固定资产清理                                             | `fixed_assets_liquidation`                         |              |
| L2       | 生产性生物资产                                           | `productive_biological_assets`                     |              |
| L2       | 油气资产                                                 | `oil_and_gas_assets`                               |              |
| L2       | 使用权资产                                               | `right_of_use_assets`                              |              |
| L2       | 无形资产                                                 | `intangible_assets`                                |              |
| L2       | 非流动资产平衡项目                                       | `balance_items`                                    |              |
| L2       | 开发支出                                                 | `development_expenses`                             |              |
| L2       | 商誉                                                     | `goodwill`                                         |              |
| L2       | 长期待摊费用                                             | `long_term_deferred_expenses`                      |              |
| L2       | 递延所得税资产                                           | `deferred_tax_assets`                              |              |
| L2       | 其他非流动资产                                           | `other_non_current_assets`                         |              |
| L2       | 非流动资产其他项目                                       | `other_items`                                      |              |
| L2       | **非流动资产合计**                                       | **`total_non_current_assets`**                     |              |
| **L1**   | **资产总计**                                             | **`assets_summary`**                               | **父级对象** |
| L2       | 资产其他项目                                             | `other_asset_items`                                |              |
| L2       | 资产平衡项目                                             | `asset_balance_items`                              |              |
| L2       | 资产总计                                                 | `total_assets`                                     |              |
| **L1**   | **流动负债**                                             | **`current_liabilities`**                          | **父级对象** |
| L2       | 短期借款                                                 | `short_term_borrowings`                            |              |
| L2       | 向中央银行借款                                           | `borrowings_from_central_bank`                     |              |
| L2       | 吸收存款及同业存放                                       | `deposits_and_interbank_placements`                |              |
| L2       | 拆入资金                                                 | `borrowings_from_interbank`                        |              |
| L2       | 交易性金融负债                                           | `trading_financial_liabilities`                    |              |
| **L2**   | **以公允价值计量且其变动计入当期损益的金融负债**         | **`financial_liabilities_fvpl`**                   | **子级对象** |
| L3       | 其中:交易性金融负债                                      | `trading_financial_liabilities`                    |              |
| L3       | 其中:指定以公允价值计量且其变动计入当期损益的金融负债    | `designated_financial_liabilities_fvpl`            |              |
| L2       | 衍生金融负债                                             | `derivative_financial_liabilities`                 |              |
| **L2**   | **应付票据及应付账款**                                   | **`notes_and_accounts_payable`**                   | **子级对象** |
| L3       | 应付票据                                                 | `notes_payable`                                    |              |
| L3       | 应付账款                                                 | `accounts_payable`                                 |              |
| L2       | 预收款项                                                 | `advances_from_customers`                          |              |
| L2       | 合同负债                                                 | `contract_liabilities`                             |              |
| L2       | 卖出回购金融资产款                                       | `sell_buy_back_financial_assets`                   |              |
| L2       | 应付手续费及佣金                                         | `fees_and_commissions_payable`                     |              |
| L2       | 应付职工薪酬                                             | `payroll_payable`                                  |              |
| L2       | 应交税费                                                 | `taxes_payable`                                    |              |
| **L2**   | **其他应付款合计**                                       | **`other_payables_total`**                         | **子级对象** |
| L3       | 其中:应付利息                                            | `interest_payable`                                 |              |
| L3       | 其中:应付股利                                            | `dividends_payable`                                |              |
| L3       | 其中:其他应付款                                          | `other_payables`                                   |              |
| L2       | 应付分保账款                                             | `reinsurance_accounts_payable`                     |              |
| L2       | 内部应付款                                               | `internal_payables`                                |              |
| L2       | 预计流动负债                                             | `estimated_current_liabilities`                    |              |
| L2       | 保险合同准备金                                           | `insurance_contract_reserves`                      |              |
| L2       | 代理买卖证券款                                           | `acting_trading_securities`                        |              |
| L2       | 代理承销证券款                                           | `acting_underwriting_securities`                   |              |
| L2       | 一年内的递延收益                                         | `deferred_revenue_within_1y`                       |              |
| L2       | 以摊余成本计量的金融负债                                 | `financial_liabilities_amortized_cost`             |              |
| L2       | 应付短期债券                                             | `short_term_bonds_payable`                         |              |
| L2       | 划分为持有待售的负债                                     | `liabilities_held_for_sale`                        |              |
| L2       | 一年内到期的非流动负债                                   | `non_current_liabilities_due_within_1y`            |              |
| L2       | 代理业务负债                                             | `agency_business_liabilities`                      |              |
| L2       | 其他流动负债                                             | `other_current_liabilities`                        |              |
| L2       | 流动负债其他项目                                         | `other_items`                                      |              |
| L2       | 流动负债平衡项目                                         | `balance_items`                                    |              |
| L2       | **流动负债合计**                                         | **`total_current_liabilities`**                    |              |
| **L1**   | **非流动负债**                                           | **`non_current_liabilities`**                      | **父级对象** |
| L2       | 长期借款                                                 | `long_term_borrowings`                             |              |
| L2       | 以摊余成本计量的金融负债(非流动)                         | `financial_liabilities_amortized_cost_non_current` |              |
| **L2**   | **应付债券**                                             | **`bonds_payable`**                                | **子级对象** |
| L3       | 其中:优先股(应付债券)                                    | `preference_shares`                                |              |
| L3       | 其中:永续债(应付债券)                                    | `perpetual_bonds`                                  |              |
| L2       | 租赁负债                                                 | `lease_liabilities`                                |              |
| L2       | 长期应付款                                               | `long_term_payables`                               |              |
| L2       | 长期应付职工薪酬                                         | `long_term_payroll_payable`                        |              |
| L2       | 专项应付款                                               | `special_payables`                                 |              |
| L2       | 预计负债                                                 | `estimated_liabilities`                            |              |
| L2       | 递延收益                                                 | `deferred_revenue`                                 |              |
| L2       | 递延所得税负债                                           | `deferred_tax_liabilities`                         |              |
| L2       | 其他非流动负债                                           | `other_non_current_liabilities`                    |              |
| L2       | 非流动负债其他项目                                       | `other_items`                                      |              |
| L2       | 非流动负债平衡项目                                       | `balance_items`                                    |              |
| L2       | **非流动负债合计**                                       | **`total_non_current_liabilities`**                |              |
| **L1**   | **负债总计**                                             | **`liabilities_summary`**                          | **父级对象** |
| L2       | 负债其他项目                                             | `other_liability_items`                            |              |
| L2       | 负债平衡项目                                             | `liability_balance_items`                          |              |
| L2       | 负债合计                                                 | `total_liabilities`                                |              |
| **L1**   | **所有者权益(或股东权益)**                               | **`equity`**                                       | **父级对象** |
| L2       | 实收资本(股本)                                           | `paid_in_capital`                                  |              |
| **L2**   | **其他权益工具**                                         | **`other_equity_instruments`**                     | **子级对象** |
| L3       | 其中:优先股(其他权益工具)                                | `preference_shares`                                |              |
| L3       | 其中:永续债(其他权益工具)                                | `perpetual_bonds`                                  |              |
| L3       | 其中:其他(其他权益工具)                                  | `other`                                            |              |
| L2       | 资本公积金                                               | `capital_reserves`                                 |              |
| L2       | 其他综合收益                                             | `other_comprehensive_income`                       |              |
| L2       | 库存股                                                   | `treasury_stock`                                   |              |
| L2       | 专项储备                                                 | `special_reserves`                                 |              |
| L2       | 盈余公积                                                 | `surplus_reserves`                                 |              |
| L2       | 一般风险准备                                             | `general_risk_reserves`                            |              |
| L2       | 未确定的投资损失                                         | `unconfirmed_investment_loss`                      |              |
| L2       | 未分配利润                                               | `undistributed_profit`                             |              |
| L2       | 拟分配现金股利                                           | `proposed_cash_dividends`                          |              |
| L2       | 外币报表折算差额                                         | `currency_translation_diff`                        |              |
| L2       | 归属于母公司股东权益其他项目                             | `parent_equity_other_items`                        |              |
| L2       | 归属于母公司股东权益平衡项目                             | `parent_equity_balance_items`                      |              |
| L2       | **归属于母公司股东权益合计**                             | **`total_parent_equity`**                          |              |
| L2       | 少数股东权益                                             | `minority_interests`                               |              |
| L2       | 股东权益其他项目                                         | `equity_other_items`                               |              |
| L2       | 股权权益平衡项目                                         | `equity_balance_items`                             |              |
| L2       | **股东权益合计**                                         | **`total_equity`**                                 |              |
| **L1**   | **负债和股东权益总计**                                   | **`balance_check`**                                | **父级对象** |
| L2       | 负债和股东权益其他项目                                   | `liabilities_and_equity_other_items`               |              |
| L2       | 负债及股东权益平衡项目                                   | `liabilities_and_equity_balance_items`             |              |
| L2       | 负债和股东权益合计                                       | `total_liabilities_and_equity`                     |              |

#### **3. 现金流量表 (Cash Flow Statement)**

| **层级** | **原始中文项目**                                   | **英文 Key (JSON)**                            | **说明**     |
| -------- | -------------------------------------------------- | ---------------------------------------------- | ------------ |
| **L1**   | **一、经营活动产生的现金流量**                     | **`operating_activities`**                     | **父级对象** |
| L2       | 销售商品、提供劳务收到的现金                       | `cash_received_from_goods_and_services`        |              |
| L2       | 客户存款和同业存放款项净增加额                     | `net_increase_deposits_interbank`              |              |
| L2       | 向中央银行借款净增加额                             | `net_increase_borrowings_central_bank`         |              |
| L2       | 向其他金融机构拆入资金净增加额                     | `net_increase_borrowings_other_financial`      |              |
| L2       | 收到原保险合同保费取得的现金                       | `cash_received_original_premiums`              |              |
| L2       | 收到再保险业务现金净额                             | `net_cash_received_reinsurance`                |              |
| L2       | 保户储金及投资款净增加额                           | `net_increase_insured_investment`              |              |
| L2       | 处置交易性金融资产净增加额                         | `net_increase_disposal_trading_assets`         |              |
| L2       | 收取利息、手续费及佣金的现金                       | `cash_received_interest_commission`            |              |
| L2       | 拆入资金净增加额                                   | `net_increase_borrowed_funds`                  |              |
| L2       | 发放贷款及垫款的净减少额                           | `net_decrease_loans_advances`                  |              |
| L2       | 回购业务资金净增加额                               | `net_increase_repurchase_funds`                |              |
| L2       | 收到的税费返还                                     | `tax_refunds_received`                         |              |
| L2       | 收到其他与经营活动有关的现金                       | `other_cash_received_operating`                |              |
| L2       | 经营活动现金流入其他项目                           | `inflow_other_items`                           |              |
| L2       | 经营活动现金流入平衡项目                           | `inflow_balance_items`                         |              |
| L2       | 经营活动现金流入小计                               | `subtotal_cash_inflow_operating`               |              |
| L2       | 购买商品、接受劳务支付的现金                       | `cash_paid_for_goods_and_services`             |              |
| L2       | 客户贷款及垫款净增加额                             | `net_increase_loans_advances`                  |              |
| L2       | 存放中央银行和同业款项净增加额                     | `net_increase_deposits_central_bank_interbank` |              |
| L2       | 支付原保险合同赔付款项的现金                       | `cash_paid_original_contract_claims`           |              |
| L2       | 支付利息、手续费及佣金的现金                       | `cash_paid_interest_commission`                |              |
| L2       | 支付保单红利的现金                                 | `cash_paid_policy_dividends`                   |              |
| L2       | 支付给职工以及为职工支付的现金                     | `cash_paid_to_employees`                       |              |
| L2       | 支付的各项税费                                     | `taxes_paid`                                   |              |
| L2       | 支付其他与经营活动有关的现金                       | `other_cash_paid_operating`                    |              |
| L2       | 经营活动现金流出其他项目                           | `outflow_other_items`                          |              |
| L2       | 经营活动现金流出平衡项目                           | `outflow_balance_items`                        |              |
| L2       | 经营活动现金流出小计                               | `subtotal_cash_outflow_operating`              |              |
| L2       | 经营活动产生的现金流量净额其他项目                 | `net_cash_flow_other_items`                    |              |
| L2       | 经营活动现金流量净额平衡项目                       | `net_cash_flow_balance_items`                  |              |
| L2       | **经营活动产生的现金流量净额**                     | **`net_cash_flow_from_operating`**             |              |
| **L1**   | **二、投资活动产生的现金流量**                     | **`investing_activities`**                     | **父级对象** |
| L2       | 收回投资收到的现金                                 | `cash_received_from_investment_recovery`       |              |
| L2       | 取得投资收益收到的现金                             | `cash_received_from_investment_income`         |              |
| L2       | 处置固定资产、无形资产和其他长期资产收回的现金净额 | `net_cash_from_disposal_assets`                |              |
| L2       | 处置子公司及其他营业单位收到的现金净额             | `net_cash_from_disposal_subsidiaries`          |              |
| L2       | 减少质押和定期存款所收到的现金                     | `cash_received_from_pledge_deposit_reduction`  |              |
| L2       | 收到其他与投资活动有关的现金                       | `other_cash_received_investing`                |              |
| L2       | 投资活动现金流入其他项目                           | `inflow_other_items`                           |              |
| L2       | 投资活动现金流入平衡项目                           | `inflow_balance_items`                         |              |
| L2       | 投资活动现金流入小计                               | `subtotal_cash_inflow_investing`               |              |
| L2       | 购建固定资产、无形资产和其他长期资产支付的现金     | `cash_paid_for_assets`                         |              |
| L2       | 投资支付的现金                                     | `cash_paid_for_investments`                    |              |
| L2       | 质押贷款净增加额                                   | `net_increase_pledged_loans`                   |              |
| L2       | 取得子公司及其他营业单位支付的现金净额             | `net_cash_paid_subsidiaries`                   |              |
| L2       | 增加质押和定期存款所支付的现金                     | `cash_paid_for_pledge_deposit_increase`        |              |
| L2       | 支付其他与投资活动有关的现金                       | `other_cash_paid_investing`                    |              |
| L2       | 投资活动现金流出其他项目                           | `outflow_other_items`                          |              |
| L2       | 投资活动现金流出平衡项目                           | `outflow_balance_items`                        |              |
| L2       | 投资活动现金流出小计                               | `subtotal_cash_outflow_investing`              |              |
| L2       | 投资活动产生的现金流量净额其他项目                 | `net_cash_flow_other_items`                    |              |
| L2       | 投资活动产生的现金流量净额平衡项目                 | `net_cash_flow_balance_items`                  |              |
| L2       | **投资活动产生的现金流量净额**                     | **`net_cash_flow_from_investing`**             |              |
| **L1**   | **三、筹资活动产生的现金流量**                     | **`financing_activities`**                     | **父级对象** |
| **L2**   | **吸收投资收到的现金**                             | **`cash_received_from_investments`**           | **子级对象** |
| L3       | 其中:子公司吸收少数股东投资收到的现金              | `from_minority_shareholders`                   |              |
| L2       | 取得借款收到的现金                                 | `cash_received_from_borrowings`                |              |
| L2       | 发行债券收到的现金                                 | `cash_received_from_bond_issue`                |              |
| L2       | 收到其他与筹资活动有关的现金                       | `other_cash_received_financing`                |              |
| L2       | 筹资活动现金流入其他项目                           | `inflow_other_items`                           |              |
| L2       | 筹资活动现金流入平衡项目                           | `inflow_balance_items`                         |              |
| L2       | 筹资活动现金流入小计                               | `subtotal_cash_inflow_financing`               |              |
| L2       | 偿还债务支付的现金                                 | `cash_paid_for_debt_repayment`                 |              |
| L2       | 分配股利、利润或偿付利息支付的现金                 | `cash_paid_for_dividends_and_profits`          |              |
| L2       | 子公司支付给少数股东的股利、利润                   | `dividends_paid_to_minority`                   |              |
| L2       | 购买子公司少数股权而支付的现金                     | `cash_paid_for_minority_equity`                |              |
| **L2**   | **支付其他与筹资活动有关的现金**                   | **`other_cash_paid_financing`**                | **子级对象** |
| L3       | 其中：子公司减资支付给少数股东的现金               | `paid_to_minority_for_capital_reduction`       |              |
| L2       | 筹资活动现金流出其他项目                           | `outflow_other_items`                          |              |
| L2       | 筹资活动现金流出平衡项目                           | `outflow_balance_items`                        |              |
| L2       | 筹资活动现金流出小计                               | `subtotal_cash_outflow_financing`              |              |
| L2       | 筹资活动产生的现金流量净额其他项目                 | `net_cash_flow_other_items`                    |              |
| L2       | 筹资活动产生的现金流量净额平衡项目                 | `net_cash_flow_balance_items`                  |              |
| L2       | **筹资活动产生的现金流量净额**                     | **`net_cash_flow_from_financing`**             |              |
| **L1**   | **四、现金及现金等价物净增加**                     | **`cash_increase`**                            | **父级对象** |
| L2       | 汇率变动对现金及现金等价物的影响                   | `exchange_rate_effect`                         |              |
| L2       | 现金及现金等价物净增加额其他项目                   | `increase_other_items`                         |              |
| L2       | 现金及现金等价物净增加额平衡项目                   | `increase_balance_items`                       |              |
| L2       | **现金及现金等价物净增加额**                       | **`net_increase_cash_and_equivalents`**        |              |
| L2       | 期初现金及现金等价物余额                           | `cash_at_beginning`                            |              |
| L2       | 期末现金及现金等价物余额其他项目                   | `end_balance_other_items`                      |              |
| L2       | 期末现金及现金等价物余额平衡项目                   | `end_balance_balance_items`                    |              |
| L2       | **期末现金及现金等价物余额**                       | **`cash_at_end`**                              |              |

#### **4. 补充资料 (Supplementary Info)**

| **层级** | **原始中文项目**                               | **英文 Key (JSON)**                          | **说明**     |
| -------- | ---------------------------------------------- | -------------------------------------------- | ------------ |
| **L1**   | **补充资料**                                   | **`supplementary_info`**                     | **父级对象** |
| **L2**   | **净利润-现金流量表**                          | **`net_profit_adjustment`**                  | **子级对象** |
| L3       | 净利润-现金流量表                              | `net_profit`                                 |              |
| L3       | 资产减值准备                                   | `asset_impairment_reserves`                  |              |
| L3       | 固定资产和投资性房地产折旧                     | `depreciation_fixed_assets_investment_props` |              |
| L3       | 固定资产折旧、油气资产折耗、生产性生物资产折旧 | `depreciation_others`                        |              |
| L3       | 投资性房地产折旧                               | `depreciation_investment_props`              |              |
| L3       | 无形资产摊销                                   | `amortization_intangible_assets`             |              |
| L3       | 长期待摊费用摊销                               | `amortization_long_term_deferred`            |              |
| L3       | 递延收益摊销                                   | `amortization_deferred_revenue`              |              |
| L3       | 待摊费用的减少                                 | `decrease_deferred_expenses`                 |              |
| L3       | 预提费用的增加                                 | `increase_accrued_expenses`                  |              |
| L3       | 处置固定资产、无形资产和其他长期资产的损失     | `loss_disposal_assets`                       |              |
| L3       | 固定资产报废损失                               | `loss_scrapping_assets`                      |              |
| L3       | 公允价值变动损失                               | `loss_fair_value_change`                     |              |
| L3       | 财务费用                                       | `financial_expenses`                         |              |
| L3       | 投资损失                                       | `investment_loss`                            |              |
| L3       | 递延所得税                                     | `deferred_tax`                               |              |
| L3       | 递延所得税资产减少                             | `decrease_deferred_tax_assets`               |              |
| L3       | 递延所得税负债增加                             | `increase_deferred_tax_liabilities`          |              |
| L3       | 预计负债的增加                                 | `increase_estimated_liabilities`             |              |
| L3       | 存货的减少                                     | `decrease_inventories`                       |              |
| L3       | 经营性应收项目的减少                           | `decrease_operating_receivables`             |              |
| L3       | 经营性应付项目的增加                           | `increase_operating_payables`                |              |
| L3       | 其他                                           | `other`                                      |              |
| L3       | 经营活动现金流量净额其他项目                   | `net_cash_flow_other_items`                  |              |
| L3       | 经营活动现金流量净额平衡项目                   | `net_cash_flow_balance_items`                |              |
| **L2**   | **间接法-经营活动产生的现金流量净额**          | **`indirect_method_result`**                 | **子级对象** |
| L3       | 间接法-经营活动产生的现金流量净额              | `net_cash_flow_from_operating_indirect`      |              |
| **L2**   | **不涉及现金收支的重大活动**                   | **`significant_non_cash`**                   | **子级对象** |
| L3       | 债务转为资本                                   | `debt_to_capital`                            |              |
| L3       | 一年内到期的可转换公司债券                     | `convertible_bonds_due_within_1y`            |              |
| L3       | 融资租入固定资产                               | `fixed_assets_finance_lease`                 |              |
| L3       | 不涉及现金收支的投资和筹资活动金额其他项目     | `non_cash_items_other`                       |              |
| **L2**   | **现金及等价物变动情况**                       | **`cash_change_check`**                      | **子级对象** |
| L3       | 现金的期末余额                                 | `cash_end_balance`                           |              |
| L3       | 现金的期初余额                                 | `cash_begin_balance`                         |              |
| L3       | 现金等价物的期末余额                           | `equivalents_end_balance`                    |              |
| L3       | 现金等价物的期初余额                           | `equivalents_begin_balance`                  |              |
| L3       | 现金及现金等价物净增加额其他项目               | `net_increase_other`                         |              |
| L3       | 现金及现金等价物净增加额平衡项目               | `net_increase_balance`                       |              |
| L3       | 间接法-现金及现金等价物的净增加额              | `net_increase_cash_and_equivalents_indirect` |              |
| L3       | 信用减值损失                                   | `credit_impairment_loss`                     |              |

------

### 第二部分：完整 JSON 数据模板

JSON

```json
{
  "company_meta": {
    "name": "Company Name Placeholder",
    "stock_code": "000000",
    "currency": "CNY"
  },
  "reports": [
    {
      "fiscal_year": "2023",
      "period_type": "Annual",
      "data": {
        "income_statement": {
          "title": "Income Statement",
          "items": {
            "total_operating_revenue": {
              "amount": 0,
              "operating_revenue": 0,
              "interest_income": 0,
              "earned_premiums": 0,
              "fee_and_commission_income": 0,
              "other_business_revenue": 0,
              "other_items": 0
            },
            "total_operating_cost": {
              "amount": 0,
              "operating_cost": 0,
              "interest_expenses": 0,
              "fee_and_commission_expenses": 0,
              "taxes_and_surcharges": 0,
              "selling_expenses": 0,
              "admin_expenses": 0,
              "rd_expenses": 0,
              "financial_expenses": {
                "amount": 0,
                "interest_expenses": 0,
                "interest_income": 0
              },
              "asset_impairment_loss": 0,
              "credit_impairment_loss": 0,
              "surrender_value": 0,
              "net_compensation_expenses": 0,
              "net_insurance_contract_reserves": 0,
              "policy_dividend_expenses": 0,
              "reinsurance_expenses": 0,
              "other_business_costs": 0,
              "other_items": 0
            },
            "other_operating_income": {
              "amount": 0,
              "fair_value_change_income": 0,
              "investment_income": 0,
              "investment_income_from_associates_jv": 0,
              "net_exposure_hedging_income": 0,
              "exchange_income": 0,
              "asset_disposal_income": 0,
              "asset_impairment_loss_new": 0,
              "credit_impairment_loss_new": 0,
              "other_income": 0,
              "operating_profit_other_items": 0,
              "operating_profit_balance_items": 0
            },
            "operating_profit": {
              "amount": 0,
              "non_operating_revenue": 0,
              "non_current_asset_disposal_gain": 0,
              "non_operating_expenses": 0,
              "non_current_asset_disposal_loss": 0,
              "other_items_affecting_total_profit": 0,
              "total_profit_balance_items": 0
            },
            "total_profit": {
              "amount": 0,
              "income_tax": 0,
              "unconfirmed_investment_loss": 0,
              "other_items_affecting_net_profit": 0,
              "net_profit_difference": 0
            },
            "net_profit": {
              "amount": 0,
              "net_profit_continuing_ops": 0,
              "net_profit_discontinued_ops": 0,
              "profit_from_merged_party_before_merger": 0,
              "net_profit_attr_to_parent": 0,
              "minority_interest_income": 0,
              "net_profit_deducting_non_recurring": 0,
              "other_items": 0,
              "balance_items": 0
            },
            "earnings_per_share": {
              "basic_eps": 0,
              "diluted_eps": 0
            },
            "other_comprehensive_income": {
              "amount": 0,
              "attr_to_parent": 0,
              "attr_to_minority": 0
            },
            "total_comprehensive_income": {
              "amount": 0,
              "attr_to_parent": 0,
              "attr_to_minority": 0,
              "derecognition_income_amortized_cost": 0
            }
          }
        },
        "balance_sheet": {
          "title": "Balance Sheet",
          "assets": {
            "current_assets": {
              "monetary_funds": 0,
              "clearing_settlement_funds": 0,
              "lending_funds": 0,
              "funds_lent": 0,
              "trading_financial_assets": 0,
              "financial_assets_fvpl": {
                "amount": 0,
                "trading_financial_assets": 0,
                "designated_financial_assets_fvpl": 0
              },
              "derivative_financial_assets": 0,
              "notes_and_accounts_receivable": {
                "amount": 0,
                "notes_receivable": 0,
                "accounts_receivable": 0
              },
              "receivables_financing": 0,
              "prepayments": 0,
              "premiums_receivable": 0,
              "reinsurance_accounts_receivable": 0,
              "reinsurance_contract_reserves_receivable": 0,
              "other_receivables_total": {
                "amount": 0,
                "interest_receivable": 0,
                "dividends_receivable": 0,
                "other_receivables": 0
              },
              "export_tax_refund_receivable": 0,
              "subsidies_receivable": 0,
              "internal_receivables": 0,
              "buy_back_financial_assets": 0,
              "financial_assets_amortized_cost": 0,
              "inventories": 0,
              "financial_assets_fvoci": 0,
              "contract_assets": 0,
              "assets_held_for_sale": 0,
              "non_current_assets_due_within_1y": 0,
              "agency_business_assets": 0,
              "other_current_assets": 0,
              "other_items": 0,
              "balance_items": 0,
              "total_current_assets": 0
            },
            "non_current_assets": {
              "loans_and_advances": 0,
              "debt_investments": 0,
              "other_debt_investments": 0,
              "financial_assets_amortized_cost_non_current": 0,
              "financial_assets_fvoci_non_current": 0,
              "available_for_sale_financial_assets": 0,
              "held_to_maturity_investments": 0,
              "long_term_receivables": 0,
              "long_term_equity_investments": 0,
              "investment_properties": 0,
              "fixed_assets": 0,
              "construction_in_progress": 0,
              "construction_materials": 0,
              "other_equity_instrument_investments": 0,
              "other_non_current_financial_assets": 0,
              "fixed_assets_liquidation": 0,
              "productive_biological_assets": 0,
              "oil_and_gas_assets": 0,
              "right_of_use_assets": 0,
              "intangible_assets": 0,
              "balance_items": 0,
              "development_expenses": 0,
              "goodwill": 0,
              "long_term_deferred_expenses": 0,
              "deferred_tax_assets": 0,
              "other_non_current_assets": 0,
              "other_items": 0,
              "total_non_current_assets": 0
            },
            "assets_summary": {
              "other_asset_items": 0,
              "asset_balance_items": 0,
              "total_assets": 0
            }
          },
          "liabilities": {
            "current_liabilities": {
              "short_term_borrowings": 0,
              "borrowings_from_central_bank": 0,
              "deposits_and_interbank_placements": 0,
              "borrowings_from_interbank": 0,
              "trading_financial_liabilities": 0,
              "financial_liabilities_fvpl": {
                "amount": 0,
                "trading_financial_liabilities": 0,
                "designated_financial_liabilities_fvpl": 0
              },
              "derivative_financial_liabilities": 0,
              "notes_and_accounts_payable": {
                "amount": 0,
                "notes_payable": 0,
                "accounts_payable": 0
              },
              "advances_from_customers": 0,
              "contract_liabilities": 0,
              "sell_buy_back_financial_assets": 0,
              "fees_and_commissions_payable": 0,
              "payroll_payable": 0,
              "taxes_payable": 0,
              "other_payables_total": {
                "amount": 0,
                "interest_payable": 0,
                "dividends_payable": 0,
                "other_payables": 0
              },
              "reinsurance_accounts_payable": 0,
              "internal_payables": 0,
              "estimated_current_liabilities": 0,
              "insurance_contract_reserves": 0,
              "acting_trading_securities": 0,
              "acting_underwriting_securities": 0,
              "deferred_revenue_within_1y": 0,
              "financial_liabilities_amortized_cost": 0,
              "short_term_bonds_payable": 0,
              "liabilities_held_for_sale": 0,
              "non_current_liabilities_due_within_1y": 0,
              "agency_business_liabilities": 0,
              "other_current_liabilities": 0,
              "other_items": 0,
              "balance_items": 0,
              "total_current_liabilities": 0
            },
            "non_current_liabilities": {
              "long_term_borrowings": 0,
              "financial_liabilities_amortized_cost_non_current": 0,
              "bonds_payable": {
                "amount": 0,
                "preference_shares": 0,
                "perpetual_bonds": 0
              },
              "lease_liabilities": 0,
              "long_term_payables": 0,
              "long_term_payroll_payable": 0,
              "special_payables": 0,
              "estimated_liabilities": 0,
              "deferred_revenue": 0,
              "deferred_tax_liabilities": 0,
              "other_non_current_liabilities": 0,
              "other_items": 0,
              "balance_items": 0,
              "total_non_current_liabilities": 0
            },
            "liabilities_summary": {
              "other_liability_items": 0,
              "liability_balance_items": 0,
              "total_liabilities": 0
            }
          },
          "equity": {
            "title": "所有者权益(或股东权益)",
            "items": {
              "paid_in_capital": 0,
              "other_equity_instruments": {
                "amount": 0,
                "preference_shares": 0,
                "perpetual_bonds": 0,
                "other": 0
              },
              "capital_reserves": 0,
              "other_comprehensive_income": 0,
              "treasury_stock": 0,
              "special_reserves": 0,
              "surplus_reserves": 0,
              "general_risk_reserves": 0,
              "unconfirmed_investment_loss": 0,
              "undistributed_profit": 0,
              "proposed_cash_dividends": 0,
              "currency_translation_diff": 0,
              "parent_equity_other_items": 0,
              "parent_equity_balance_items": 0,
              "total_parent_equity": 0,
              "minority_interests": 0,
              "equity_other_items": 0,
              "equity_balance_items": 0,
              "total_equity": 0
            }
          },
          "balance_check": {
            "liabilities_and_equity_other_items": 0,
            "liabilities_and_equity_balance_items": 0,
            "total_liabilities_and_equity": 0
          }
        },
        "cash_flow_statement": {
          "title": "Cash Flow Statement",
          "items": {
            "operating_activities": {
              "cash_received_from_goods_and_services": 0,
              "net_increase_deposits_interbank": 0,
              "net_increase_borrowings_central_bank": 0,
              "net_increase_borrowings_other_financial": 0,
              "cash_received_original_premiums": 0,
              "net_cash_received_reinsurance": 0,
              "net_increase_insured_investment": 0,
              "net_increase_disposal_trading_assets": 0,
              "cash_received_interest_commission": 0,
              "net_increase_borrowed_funds": 0,
              "net_decrease_loans_advances": 0,
              "net_increase_repurchase_funds": 0,
              "tax_refunds_received": 0,
              "other_cash_received_operating": 0,
              "inflow_other_items": 0,
              "inflow_balance_items": 0,
              "subtotal_cash_inflow_operating": 0,
              "cash_paid_for_goods_and_services": 0,
              "net_increase_loans_advances": 0,
              "net_increase_deposits_central_bank_interbank": 0,
              "cash_paid_original_contract_claims": 0,
              "cash_paid_interest_commission": 0,
              "cash_paid_policy_dividends": 0,
              "cash_paid_to_employees": 0,
              "taxes_paid": 0,
              "other_cash_paid_operating": 0,
              "outflow_other_items": 0,
              "outflow_balance_items": 0,
              "subtotal_cash_outflow_operating": 0,
              "net_cash_flow_other_items": 0,
              "net_cash_flow_balance_items": 0,
              "net_cash_flow_from_operating": 0
            },
            "investing_activities": {
              "cash_received_from_investment_recovery": 0,
              "cash_received_from_investment_income": 0,
              "net_cash_from_disposal_assets": 0,
              "net_cash_from_disposal_subsidiaries": 0,
              "cash_received_from_pledge_deposit_reduction": 0,
              "other_cash_received_investing": 0,
              "inflow_other_items": 0,
              "inflow_balance_items": 0,
              "subtotal_cash_inflow_investing": 0,
              "cash_paid_for_assets": 0,
              "cash_paid_for_investments": 0,
              "net_increase_pledged_loans": 0,
              "net_cash_paid_subsidiaries": 0,
              "cash_paid_for_pledge_deposit_increase": 0,
              "other_cash_paid_investing": 0,
              "outflow_other_items": 0,
              "outflow_balance_items": 0,
              "subtotal_cash_outflow_investing": 0,
              "net_cash_flow_other_items": 0,
              "net_cash_flow_balance_items": 0,
              "net_cash_flow_from_investing": 0
            },
            "financing_activities": {
              "cash_received_from_investments": {
                "amount": 0,
                "from_minority_shareholders": 0
              },
              "cash_received_from_borrowings": 0,
              "cash_received_from_bond_issue": 0,
              "other_cash_received_financing": 0,
              "inflow_other_items": 0,
              "inflow_balance_items": 0,
              "subtotal_cash_inflow_financing": 0,
              "cash_paid_for_debt_repayment": 0,
              "cash_paid_for_dividends_and_profits": 0,
              "dividends_paid_to_minority": 0,
              "cash_paid_for_minority_equity": 0,
              "other_cash_paid_financing": {
                "amount": 0,
                "paid_to_minority_for_capital_reduction": 0
              },
              "outflow_other_items": 0,
              "outflow_balance_items": 0,
              "subtotal_cash_outflow_financing": 0,
              "net_cash_flow_other_items": 0,
              "net_cash_flow_balance_items": 0,
              "net_cash_flow_from_financing": 0
            },
            "cash_increase": {
              "exchange_rate_effect": 0,
              "increase_other_items": 0,
              "increase_balance_items": 0,
              "net_increase_cash_and_equivalents": 0,
              "cash_at_beginning": 0,
              "end_balance_other_items": 0,
              "end_balance_balance_items": 0,
              "cash_at_end": 0
            },
            "supplementary_info": {
              "net_profit_adjustment": {
                "net_profit": 0,
                "asset_impairment_reserves": 0,
                "depreciation_fixed_assets_investment_props": 0,
                "depreciation_others": 0,
                "depreciation_investment_props": 0,
                "amortization_intangible_assets": 0,
                "amortization_long_term_deferred": 0,
                "amortization_deferred_revenue": 0,
                "decrease_deferred_expenses": 0,
                "increase_accrued_expenses": 0,
                "loss_disposal_assets": 0,
                "loss_scrapping_assets": 0,
                "loss_fair_value_change": 0,
                "financial_expenses": 0,
                "investment_loss": 0,
                "deferred_tax": 0,
                "decrease_deferred_tax_assets": 0,
                "increase_deferred_tax_liabilities": 0,
                "increase_estimated_liabilities": 0,
                "decrease_inventories": 0,
                "decrease_operating_receivables": 0,
                "increase_operating_payables": 0,
                "other": 0,
                "net_cash_flow_other_items": 0,
                "net_cash_flow_balance_items": 0,
                "net_cash_flow_from_operating_indirect": 0
              },
              "significant_non_cash": {
                "debt_to_capital": 0,
                "convertible_bonds_due_within_1y": 0,
                "fixed_assets_finance_lease": 0,
                "non_cash_items_other": 0
              },
              "cash_change_check": {
                "cash_end_balance": 0,
                "cash_begin_balance": 0,
                "equivalents_end_balance": 0,
                "equivalents_begin_balance": 0,
                "net_increase_other": 0,
                "net_increase_balance": 0,
                "net_increase_cash_and_equivalents_indirect": 0
              },
              "credit_impairment_loss": 0
            }
          }
        }
      }
    },
    {
      "fiscal_year": "2024",
      "period_type": "Annual",
      "data": {}
    }
  ]
}
```