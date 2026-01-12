# Data Structure

------

### 第一部分：完整中英文键名对照表 (Mapping Table)

#### **1. 利润表 (Income Statement)**

| **序号** | **层级** | **原始中文项目**                     | **英文 Key (JSON)**                      | **说明**     |
| -------- | -------- | ------------------------------------ | ---------------------------------------- | ------------ |
| 1.1      | **L1**   | **一、营业总收入**                   | **`total_operating_revenue`**            | **父级对象** |
| 1.2      | L2       | 营业收入                             | `operating_revenue`                      |              |
| 1.3      | L2       | 利息收入                             | `interest_income`                        |              |
| 1.4      | L2       | 已赚保费                             | `earned_premiums`                        |              |
| 1.5      | L2       | 手续费及佣金收入                     | `fee_and_commission_income`              |              |
| 1.6      | L2       | 其他业务收入                         | `other_business_revenue`                 |              |
| 1.7      | L2       | 营业总收入其他项目                   | `other_items`                            |              |
| 1.8      | **L1**   | **二、营业总成本**                   | **`total_operating_cost`**               | **父级对象** |
| 1.9      | L2       | 营业成本                             | `operating_cost`                         |              |
| 1.10     | L2       | 利息支出                             | `interest_expenses`                      |              |
| 1.11     | L2       | 手续费及佣金支出                     | `fee_and_commission_expenses`            |              |
| 1.12     | L2       | 营业税金及附加                       | `taxes_and_surcharges`                   |              |
| 1.13     | L2       | 销售费用                             | `selling_expenses`                       |              |
| 1.14     | L2       | 管理费用                             | `admin_expenses`                         |              |
| 1.15     | L2       | 研发费用                             | `rd_expenses`                            |              |
| 1.16     | **L2**   | **财务费用**                         | **`financial_expenses`**                 | **子级对象** |
| 1.17     | L3       | 利息费用                             | `interest_expenses`                      |              |
| 1.18     | L3       | 利息收入                             | `interest_income`                        |              |
| 1.19     | L2       | 资产减值损失                         | `asset_impairment_loss`                  |              |
| 1.20     | L2       | 信用减值损失                         | `credit_impairment_loss`                 |              |
| 1.21     | L2       | 退保金                               | `surrender_value`                        |              |
| 1.22     | L2       | 赔付支出净额                         | `net_compensation_expenses`              |              |
| 1.23     | L2       | 提取保险合同准备金净额               | `net_insurance_contract_reserves`        |              |
| 1.24     | L2       | 保单红利支出                         | `policy_dividend_expenses`               |              |
| 1.25     | L2       | 分保费用                             | `reinsurance_expenses`                   |              |
| 1.26     | L2       | 其他业务成本                         | `other_business_costs`                   |              |
| 1.27     | L2       | 营业总成本其他项目                   | `other_items`                            |              |
| 1.28     | **L1**   | **三、其他经营收益**                 | **`other_operating_income`**             | **父级对象** |
| 1.29     | L2       | 公允价值变动收益                     | `fair_value_change_income`               |              |
| 1.30     | L2       | 投资收益                             | `investment_income`                      |              |
| 1.31     | L2       | 对联营企业和合营企业的投资收益       | `investment_income_from_associates_jv`   |              |
| 1.32     | L2       | 净敞口套期收益                       | `net_exposure_hedging_income`            |              |
| 1.33     | L2       | 汇兑收益                             | `exchange_income`                        |              |
| 1.34     | L2       | 资产处置收益                         | `asset_disposal_income`                  |              |
| 1.35     | L2       | 资产减值损失(新)                     | `asset_impairment_loss_new`              |              |
| 1.36     | L2       | 信用减值损失(新)                     | `credit_impairment_loss_new`             |              |
| 1.37     | L2       | 其他收益                             | `other_income`                           |              |
| 1.38     | L2       | 营业利润其他项目                     | `operating_profit_other_items`           |              |
| 1.39     | L2       | 营业利润平衡项目                     | `operating_profit_balance_items`         |              |
| 1.40     | **L1**   | **四、营业利润**                     | **`operating_profit`**                   | **父级对象** |
| 1.41     | L2       | 营业外收入                           | `non_operating_revenue`                  |              |
| 1.42     | L2       | 非流动资产处置利得                   | `non_current_asset_disposal_gain`        |              |
| 1.43     | L2       | 营业外支出                           | `non_operating_expenses`                 |              |
| 1.44     | L2       | 非流动资产处置净损失                 | `non_current_asset_disposal_loss`        |              |
| 1.45     | L2       | 影响利润总额的其他项目               | `other_items_affecting_total_profit`     |              |
| 1.46     | L2       | 利润总额平衡项目                     | `total_profit_balance_items`             |              |
| 1.47     | **L1**   | **五、利润总额**                     | **`total_profit`**                       | **父级对象** |
| 1.48     | L2       | 所得税                               | `income_tax`                             |              |
| 1.49     | L2       | 未确认投资损失                       | `unconfirmed_investment_loss`            |              |
| 1.50     | L2       | 影响净利润的其他项目                 | `other_items_affecting_net_profit`       |              |
| 1.51     | L2       | 净利润差额(合计平衡项目2)            | `net_profit_difference`                  |              |
| 1.52     | **L1**   | **六、净利润**                       | **`net_profit`**                         | **父级对象** |
| 1.53     | L2       | 持续经营净利润                       | `net_profit_continuing_ops`              |              |
| 1.54     | L2       | 终止经营净利润                       | `net_profit_discontinued_ops`            |              |
| 1.55     | L2       | 被合并方在合并前实现利润             | `profit_from_merged_party_before_merger` |              |
| 1.56     | L2       | 归属于母公司股东的净利润             | `net_profit_attr_to_parent`              |              |
| 1.57     | L2       | 少数股东损益                         | `minority_interest_income`               |              |
| 1.58     | L2       | 扣除非经常性损益后的净利润           | `net_profit_deducting_non_recurring`     |              |
| 1.59     | L2       | 净利润其他项目                       | `other_items`                            |              |
| 1.60     | L2       | 净利润差额(合计平衡项目)             | `balance_items`                          |              |
| 1.61     | **L1**   | **七、每股收益**                     | **`earnings_per_share`**                 | **父级对象** |
| 1.62     | L2       | (一) 基本每股收益                    | `basic_eps`                              |              |
| 1.63     | L2       | (二) 稀释每股收益                    | `diluted_eps`                            |              |
| 1.64     | **L1**   | **八、其他综合收益**                 | **`other_comprehensive_income`**         | **父级对象** |
| 1.65     | L2       | 归属于母公司股东的其他综合收益       | `attr_to_parent`                         |              |
| 1.66     | L2       | 归属于少数股东的其他综合收益         | `attr_to_minority`                       |              |
| 1.67     | **L1**   | **九、综合收益总额**                 | **`total_comprehensive_income`**         | **父级对象** |
| 1.68     | L2       | 归属于母公司所有者的综合收益总额     | `attr_to_parent`                         |              |
| 1.69     | L2       | 归属于少数股东的综合收益总额         | `attr_to_minority`                       |              |
| 1.70     | L2       | 以摊余成本计量的金融资产终止确认收益 | `derecognition_income_amortized_cost`    |              |

#### **2. 资产负债表 (Balance Sheet)**

| **序号** | **层级** | **原始中文项目**                                         | **英文 Key (JSON)**                                | **说明**     |
| -------- | -------- | -------------------------------------------------------- | -------------------------------------------------- | ------------ |
| 2.1      | **L1**   | **流动资产**                                             | **`current_assets`**                               | **父级对象** |
| 2.2      | L2       | 货币资金                                                 | `monetary_funds`                                   |              |
| 2.3      | L2       | 结算备付金                                               | `clearing_settlement_funds`                        |              |
| 2.4      | L2       | 融出资金                                                 | `lending_funds`                                    |              |
| 2.5      | L2       | 拆出资金                                                 | `funds_lent`                                       |              |
| 2.6      | L2       | 交易性金融资产                                           | `trading_financial_assets`                         |              |
| 2.7      | **L2**   | **以公允价值计量且其变动计入当期损益的金融资产**         | **`financial_assets_fvpl`**                        | **子级对象** |
| 2.8      | L3       | 其中:交易性金融资产                                      | `trading_financial_assets`                         |              |
| 2.9      | L3       | 其中:指定以公允价值计量且其变动计入当期损益的金融资产    | `designated_financial_assets_fvpl`                 |              |
| 2.10     | L2       | 衍生金融资产                                             | `derivative_financial_assets`                      |              |
| 2.11     | **L2**   | **应收票据及应收账款**                                   | **`notes_and_accounts_receivable`**                | **子级对象** |
| 2.12     | L3       | 应收票据                                                 | `notes_receivable`                                 |              |
| 2.13     | L3       | 应收账款                                                 | `accounts_receivable`                              |              |
| 2.14     | L2       | 应收款项融资                                             | `receivables_financing`                            |              |
| 2.15     | L2       | 预付款项                                                 | `prepayments`                                      |              |
| 2.16     | L2       | 应收保费                                                 | `premiums_receivable`                              |              |
| 2.17     | L2       | 应收分保账款                                             | `reinsurance_accounts_receivable`                  |              |
| 2.18     | L2       | 应收分保合同准备金                                       | `reinsurance_contract_reserves_receivable`         |              |
| 2.19     | **L2**   | **其他应收款合计**                                       | **`other_receivables_total`**                      | **子级对象** |
| 2.20     | L3       | 其中:应收利息                                            | `interest_receivable`                              |              |
| 2.21     | L3       | 其中:应收股利                                            | `dividends_receivable`                             |              |
| 2.22     | L3       | 其中:其他应收款                                          | `other_receivables`                                |              |
| 2.23     | L2       | 应收出口退税                                             | `export_tax_refund_receivable`                     |              |
| 2.24     | L2       | 应收补贴款                                               | `subsidies_receivable`                             |              |
| 2.25     | L2       | 内部应收款                                               | `internal_receivables`                             |              |
| 2.26     | L2       | 买入返售金融资产                                         | `buy_back_financial_assets`                        |              |
| 2.27     | L2       | 以摊余成本计量的金融资产                                 | `financial_assets_amortized_cost`                  |              |
| 2.28     | L2       | 存货                                                     | `inventories`                                      |              |
| 2.29     | L2       | 以公允价值计量且其变动计入其他综合收益的金融资产         | `financial_assets_fvoci`                           |              |
| 2.30     | L2       | 合同资产                                                 | `contract_assets`                                  |              |
| 2.31     | L2       | 划分为持有待售的资产                                     | `assets_held_for_sale`                             |              |
| 2.32     | L2       | 一年内到期的非流动资产                                   | `non_current_assets_due_within_1y`                 |              |
| 2.33     | L2       | 代理业务资产                                             | `agency_business_assets`                           |              |
| 2.34     | L2       | 其他流动资产                                             | `other_current_assets`                             |              |
| 2.35     | L2       | 流动资产其他项目                                         | `other_items`                                      |              |
| 2.36     | L2       | 流动资产平衡项目                                         | `balance_items`                                    |              |
| 2.37     | L2       | **流动资产合计**                                         | **`total_current_assets`**                         |              |
| 2.38     | **L1**   | **非流动资产**                                           | **`non_current_assets`**                           | **父级对象** |
| 2.39     | L2       | 发放贷款及垫款                                           | `loans_and_advances`                               |              |
| 2.40     | L2       | 债权投资                                                 | `debt_investments`                                 |              |
| 2.41     | L2       | 其他债权投资                                             | `other_debt_investments`                           |              |
| 2.42     | L2       | 以摊余成本计量的金融资产(非流动)                         | `financial_assets_amortized_cost_non_current`      |              |
| 2.43     | L2       | 以公允价值计量且其变动计入其他综合收益的金融资产(非流动) | `financial_assets_fvoci_non_current`               |              |
| 2.44     | L2       | 可供出售金融资产                                         | `available_for_sale_financial_assets`              |              |
| 2.45     | L2       | 持有至到期投资                                           | `held_to_maturity_investments`                     |              |
| 2.46     | L2       | 长期应收款                                               | `long_term_receivables`                            |              |
| 2.47     | L2       | 长期股权投资                                             | `long_term_equity_investments`                     |              |
| 2.48     | L2       | 投资性房地产                                             | `investment_properties`                            |              |
| 2.49     | L2       | 固定资产                                                 | `fixed_assets`                                     |              |
| 2.50     | L2       | 在建工程                                                 | `construction_in_progress`                         |              |
| 2.51     | L2       | 工程物资                                                 | `construction_materials`                           |              |
| 2.52     | L2       | 其他权益工具投资                                         | `other_equity_instrument_investments`              |              |
| 2.53     | L2       | 其他非流动金融资产                                       | `other_non_current_financial_assets`               |              |
| 2.54     | L2       | 固定资产清理                                             | `fixed_assets_liquidation`                         |              |
| 2.55     | L2       | 生产性生物资产                                           | `productive_biological_assets`                     |              |
| 2.56     | L2       | 油气资产                                                 | `oil_and_gas_assets`                               |              |
| 2.57     | L2       | 使用权资产                                               | `right_of_use_assets`                              |              |
| 2.58     | L2       | 无形资产                                                 | `intangible_assets`                                |              |
| 2.59     | L2       | 非流动资产平衡项目                                       | `balance_items`                                    |              |
| 2.60     | L2       | 开发支出                                                 | `development_expenses`                             |              |
| 2.61     | L2       | 商誉                                                     | `goodwill`                                         |              |
| 2.62     | L2       | 长期待摊费用                                             | `long_term_deferred_expenses`                      |              |
| 2.63     | L2       | 递延所得税资产                                           | `deferred_tax_assets`                              |              |
| 2.64     | L2       | 其他非流动资产                                           | `other_non_current_assets`                         |              |
| 2.65     | L2       | 非流动资产其他项目                                       | `other_items`                                      |              |
| 2.66     | L2       | **非流动资产合计**                                       | **`total_non_current_assets`**                     |              |
| 2.67     | **L1**   | **资产总计**                                             | **`assets_summary`**                               | **父级对象** |
| 2.68     | L2       | 资产其他项目                                             | `other_asset_items`                                |              |
| 2.69     | L2       | 资产平衡项目                                             | `asset_balance_items`                              |              |
| 2.70     | L2       | 资产总计                                                 | `total_assets`                                     |              |
| 2.71     | **L1**   | **流动负债**                                             | **`current_liabilities`**                          | **父级对象** |
| 2.72     | L2       | 短期借款                                                 | `short_term_borrowings`                            |              |
| 2.73     | L2       | 向中央银行借款                                           | `borrowings_from_central_bank`                     |              |
| 2.74     | L2       | 吸收存款及同业存放                                       | `deposits_and_interbank_placements`                |              |
| 2.75     | L2       | 拆入资金                                                 | `borrowings_from_interbank`                        |              |
| 2.76     | L2       | 交易性金融负债                                           | `trading_financial_liabilities`                    |              |
| 2.77     | **L2**   | **以公允价值计量且其变动计入当期损益的金融负债**         | **`financial_liabilities_fvpl`**                   | **子级对象** |
| 2.78     | L3       | 其中:交易性金融负债                                      | `trading_financial_liabilities`                    |              |
| 2.79     | L3       | 其中:指定以公允价值计量且其变动计入当期损益的金融负债    | `designated_financial_liabilities_fvpl`            |              |
| 2.80     | L2       | 衍生金融负债                                             | `derivative_financial_liabilities`                 |              |
| 2.81     | **L2**   | **应付票据及应付账款**                                   | **`notes_and_accounts_payable`**                   | **子级对象** |
| 2.82     | L3       | 应付票据                                                 | `notes_payable`                                    |              |
| 2.83     | L3       | 应付账款                                                 | `accounts_payable`                                 |              |
| 2.84     | L2       | 预收款项                                                 | `advances_from_customers`                          |              |
| 2.85     | L2       | 合同负债                                                 | `contract_liabilities`                             |              |
| 2.86     | L2       | 卖出回购金融资产款                                       | `sell_buy_back_financial_assets`                   |              |
| 2.87     | L2       | 应付手续费及佣金                                         | `fees_and_commissions_payable`                     |              |
| 2.88     | L2       | 应付职工薪酬                                             | `payroll_payable`                                  |              |
| 2.89     | L2       | 应交税费                                                 | `taxes_payable`                                    |              |
| 2.90     | **L2**   | **其他应付款合计**                                       | **`other_payables_total`**                         | **子级对象** |
| 2.91     | L3       | 其中:应付利息                                            | `interest_payable`                                 |              |
| 2.92     | L3       | 其中:应付股利                                            | `dividends_payable`                                |              |
| 2.93     | L3       | 其中:其他应付款                                          | `other_payables`                                   |              |
| 2.94     | L2       | 应付分保账款                                             | `reinsurance_accounts_payable`                     |              |
| 2.95     | L2       | 内部应付款                                               | `internal_payables`                                |              |
| 2.96     | L2       | 预计流动负债                                             | `estimated_current_liabilities`                    |              |
| 2.97     | L2       | 保险合同准备金                                           | `insurance_contract_reserves`                      |              |
| 2.98     | L2       | 代理买卖证券款                                           | `acting_trading_securities`                        |              |
| 2.99     | L2       | 代理承销证券款                                           | `acting_underwriting_securities`                   |              |
| 2.100    | L2       | 一年内的递延收益                                         | `deferred_revenue_within_1y`                       |              |
| 2.101    | L2       | 以摊余成本计量的金融负债                                 | `financial_liabilities_amortized_cost`             |              |
| 2.102    | L2       | 应付短期债券                                             | `short_term_bonds_payable`                         |              |
| 2.103    | L2       | 划分为持有待售的负债                                     | `liabilities_held_for_sale`                        |              |
| 2.104    | L2       | 一年内到期的非流动负债                                   | `non_current_liabilities_due_within_1y`            |              |
| 2.105    | L2       | 代理业务负债                                             | `agency_business_liabilities`                      |              |
| 2.106    | L2       | 其他流动负债                                             | `other_current_liabilities`                        |              |
| 2.107    | L2       | 流动负债其他项目                                         | `other_items`                                      |              |
| 2.108    | L2       | 流动负债平衡项目                                         | `balance_items`                                    |              |
| 2.109    | L2       | **流动负债合计**                                         | **`total_current_liabilities`**                    |              |
| 2.110    | **L1**   | **非流动负债**                                           | **`non_current_liabilities`**                      | **父级对象** |
| 2.111    | L2       | 长期借款                                                 | `long_term_borrowings`                             |              |
| 2.112    | L2       | 以摊余成本计量的金融负债(非流动)                         | `financial_liabilities_amortized_cost_non_current` |              |
| 2.113    | **L2**   | **应付债券**                                             | **`bonds_payable`**                                | **子级对象** |
| 2.114    | L3       | 其中:优先股(应付债券)                                    | `preference_shares`                                |              |
| 2.115    | L3       | 其中:永续债(应付债券)                                    | `perpetual_bonds`                                  |              |
| 2.116    | L2       | 租赁负债                                                 | `lease_liabilities`                                |              |
| 2.117    | L2       | 长期应付款                                               | `long_term_payables`                               |              |
| 2.118    | L2       | 长期应付职工薪酬                                         | `long_term_payroll_payable`                        |              |
| 2.119    | L2       | 专项应付款                                               | `special_payables`                                 |              |
| 2.120    | L2       | 预计负债                                                 | `estimated_liabilities`                            |              |
| 2.121    | L2       | 递延收益                                                 | `deferred_revenue`                                 |              |
| 2.122    | L2       | 递延所得税负债                                           | `deferred_tax_liabilities`                         |              |
| 2.123    | L2       | 其他非流动负债                                           | `other_non_current_liabilities`                    |              |
| 2.124    | L2       | 非流动负债其他项目                                       | `other_items`                                      |              |
| 2.125    | L2       | 非流动负债平衡项目                                       | `balance_items`                                    |              |
| 2.126    | L2       | **非流动负债合计**                                       | **`total_non_current_liabilities`**                |              |
| 2.127    | **L1**   | **负债总计**                                             | **`liabilities_summary`**                          | **父级对象** |
| 2.128    | L2       | 负债其他项目                                             | `other_liability_items`                            |              |
| 2.129    | L2       | 负债平衡项目                                             | `liability_balance_items`                          |              |
| 2.130    | L2       | 负债合计                                                 | `total_liabilities`                                |              |
| 2.131    | **L1**   | **所有者权益(或股东权益)**                               | **`equity`**                                       | **父级对象** |
| 2.132    | L2       | 实收资本(股本)                                           | `paid_in_capital`                                  |              |
| 2.133    | **L2**   | **其他权益工具**                                         | **`other_equity_instruments`**                     | **子级对象** |
| 2.134    | L3       | 其中:优先股(其他权益工具)                                | `preference_shares`                                |              |
| 2.135    | L3       | 其中:永续债(其他权益工具)                                | `perpetual_bonds`                                  |              |
| 2.136    | L3       | 其中:其他(其他权益工具)                                  | `other`                                            |              |
| 2.137    | L2       | 资本公积金                                               | `capital_reserves`                                 |              |
| 2.138    | L2       | 其他综合收益                                             | `other_comprehensive_income`                       |              |
| 2.139    | L2       | 库存股                                                   | `treasury_stock`                                   |              |
| 2.140    | L2       | 专项储备                                                 | `special_reserves`                                 |              |
| 2.141    | L2       | 盈余公积                                                 | `surplus_reserves`                                 |              |
| 2.142    | L2       | 一般风险准备                                             | `general_risk_reserves`                            |              |
| 2.143    | L2       | 未确定的投资损失                                         | `unconfirmed_investment_loss`                      |              |
| 2.144    | L2       | 未分配利润                                               | `undistributed_profit`                             |              |
| 2.145    | L2       | 拟分配现金股利                                           | `proposed_cash_dividends`                          |              |
| 2.146    | L2       | 外币报表折算差额                                         | `currency_translation_diff`                        |              |
| 2.147    | L2       | 归属于母公司股东权益其他项目                             | `parent_equity_other_items`                        |              |
| 2.148    | L2       | 归属于母公司股东权益平衡项目                             | `parent_equity_balance_items`                      |              |
| 2.149    | L2       | **归属于母公司股东权益合计**                             | **`total_parent_equity`**                          |              |
| 2.150    | L2       | 少数股东权益                                             | `minority_interests`                               |              |
| 2.151    | L2       | 股东权益其他项目                                         | `equity_other_items`                               |              |
| 2.152    | L2       | 股权权益平衡项目                                         | `equity_balance_items`                             |              |
| 2.153    | L2       | **股东权益合计**                                         | **`total_equity`**                                 |              |
| 2.154    | **L1**   | **负债和股东权益总计**                                   | **`balance_check`**                                | **父级对象** |
| 2.155    | L2       | 负债和股东权益其他项目                                   | `liabilities_and_equity_other_items`               |              |
| 2.156    | L2       | 负债及股东权益平衡项目                                   | `liabilities_and_equity_balance_items`             |              |
| 2.157    | L2       | 负债和股东权益合计                                       | `total_liabilities_and_equity`                     |              |

#### **3. 现金流量表 (Cash Flow Statement)**

| **序号** | **层级** | **原始中文项目**                                   | **英文 Key (JSON)**                            | **说明**     |
| -------- | -------- | -------------------------------------------------- | ---------------------------------------------- | ------------ |
| 3.1      | **L1**   | **一、经营活动产生的现金流量**                     | **`operating_activities`**                     | **父级对象** |
| 3.2      | L2       | 销售商品、提供劳务收到的现金                       | `cash_received_from_goods_and_services`        |              |
| 3.3      | L2       | 客户存款和同业存放款项净增加额                     | `net_increase_deposits_interbank`              |              |
| 3.4      | L2       | 向中央银行借款净增加额                             | `net_increase_borrowings_central_bank`         |              |
| 3.5      | L2       | 向其他金融机构拆入资金净增加额                     | `net_increase_borrowings_other_financial`      |              |
| 3.6      | L2       | 收到原保险合同保费取得的现金                       | `cash_received_original_premiums`              |              |
| 3.7      | L2       | 收到再保险业务现金净额                             | `net_cash_received_reinsurance`                |              |
| 3.8      | L2       | 保户储金及投资款净增加额                           | `net_increase_insured_investment`              |              |
| 3.9      | L2       | 处置交易性金融资产净增加额                         | `net_increase_disposal_trading_assets`         |              |
| 3.10     | L2       | 收取利息、手续费及佣金的现金                       | `cash_received_interest_commission`            |              |
| 3.11     | L2       | 拆入资金净增加额                                   | `net_increase_borrowed_funds`                  |              |
| 3.12     | L2       | 发放贷款及垫款的净减少额                           | `net_decrease_loans_advances`                  |              |
| 3.13     | L2       | 回购业务资金净增加额                               | `net_increase_repurchase_funds`                |              |
| 3.14     | L2       | 收到的税费返还                                     | `tax_refunds_received`                         |              |
| 3.15     | L2       | 收到其他与经营活动有关的现金                       | `other_cash_received_operating`                |              |
| 3.16     | L2       | 经营活动现金流入其他项目                           | `inflow_other_items`                           |              |
| 3.17     | L2       | 经营活动现金流入平衡项目                           | `inflow_balance_items`                         |              |
| 3.18     | L2       | 经营活动现金流入小计                               | `subtotal_cash_inflow_operating`               |              |
| 3.19     | L2       | 购买商品、接受劳务支付的现金                       | `cash_paid_for_goods_and_services`             |              |
| 3.20     | L2       | 客户贷款及垫款净增加额                             | `net_increase_loans_advances`                  |              |
| 3.21     | L2       | 存放中央银行和同业款项净增加额                     | `net_increase_deposits_central_bank_interbank` |              |
| 3.22     | L2       | 支付原保险合同赔付款项的现金                       | `cash_paid_original_contract_claims`           |              |
| 3.23     | L2       | 支付利息、手续费及佣金的现金                       | `cash_paid_interest_commission`                |              |
| 3.24     | L2       | 支付保单红利的现金                                 | `cash_paid_policy_dividends`                   |              |
| 3.25     | L2       | 支付给职工以及为职工支付的现金                     | `cash_paid_to_employees`                       |              |
| 3.26     | L2       | 支付的各项税费                                     | `taxes_paid`                                   |              |
| 3.27     | L2       | 支付其他与经营活动有关的现金                       | `other_cash_paid_operating`                    |              |
| 3.28     | L2       | 经营活动现金流出其他项目                           | `outflow_other_items`                          |              |
| 3.29     | L2       | 经营活动现金流出平衡项目                           | `outflow_balance_items`                        |              |
| 3.30     | L2       | 经营活动现金流出小计                               | `subtotal_cash_outflow_operating`              |              |
| 3.31     | L2       | 经营活动产生的现金流量净额其他项目                 | `net_cash_flow_other_items`                    |              |
| 3.32     | L2       | 经营活动现金流量净额平衡项目                       | `net_cash_flow_balance_items`                  |              |
| 3.33     | L2       | **经营活动产生的现金流量净额**                     | **`net_cash_flow_from_operating`**             |              |
| 3.34     | **L1**   | **二、投资活动产生的现金流量**                     | **`investing_activities`**                     | **父级对象** |
| 3.35     | L2       | 收回投资收到的现金                                 | `cash_received_from_investment_recovery`       |              |
| 3.36     | L2       | 取得投资收益收到的现金                             | `cash_received_from_investment_income`         |              |
| 3.37     | L2       | 处置固定资产、无形资产和其他长期资产收回的现金净额 | `net_cash_from_disposal_assets`                |              |
| 3.38     | L2       | 处置子公司及其他营业单位收到的现金净额             | `net_cash_from_disposal_subsidiaries`          |              |
| 3.39     | L2       | 减少质押和定期存款所收到的现金                     | `cash_received_from_pledge_deposit_reduction`  |              |
| 3.40     | L2       | 收到其他与投资活动有关的现金                       | `other_cash_received_investing`                |              |
| 3.41     | L2       | 投资活动现金流入其他项目                           | `inflow_other_items`                           |              |
| 3.42     | L2       | 投资活动现金流入平衡项目                           | `inflow_balance_items`                         |              |
| 3.43     | L2       | 投资活动现金流入小计                               | `subtotal_cash_inflow_investing`               |              |
| 3.44     | L2       | 购建固定资产、无形资产和其他长期资产支付的现金     | `cash_paid_for_assets`                         |              |
| 3.45     | L2       | 投资支付的现金                                     | `cash_paid_for_investments`                    |              |
| 3.46     | L2       | 质押贷款净增加额                                   | `net_increase_pledged_loans`                   |              |
| 3.47     | L2       | 取得子公司及其他营业单位支付的现金净额             | `net_cash_paid_subsidiaries`                   |              |
| 3.48     | L2       | 增加质押和定期存款所支付的现金                     | `cash_paid_for_pledge_deposit_increase`        |              |
| 3.49     | L2       | 支付其他与投资活动有关的现金                       | `other_cash_paid_investing`                    |              |
| 3.50     | L2       | 投资活动现金流出其他项目                           | `outflow_other_items`                          |              |
| 3.51     | L2       | 投资活动现金流出平衡项目                           | `outflow_balance_items`                        |              |
| 3.52     | L2       | 投资活动现金流出小计                               | `subtotal_cash_outflow_investing`              |              |
| 3.53     | L2       | 投资活动产生的现金流量净额其他项目                 | `net_cash_flow_other_items`                    |              |
| 3.54     | L2       | 投资活动产生的现金流量净额平衡项目                 | `net_cash_flow_balance_items`                  |              |
| 3.55     | L2       | **投资活动产生的现金流量净额**                     | **`net_cash_flow_from_investing`**             |              |
| 3.56     | **L1**   | **三、筹资活动产生的现金流量**                     | **`financing_activities`**                     | **父级对象** |
| 3.57     | **L2**   | **吸收投资收到的现金**                             | **`cash_received_from_investments`**           | **子级对象** |
| 3.58     | L3       | 其中:子公司吸收少数股东投资收到的现金              | `from_minority_shareholders`                   |              |
| 3.59     | L2       | 取得借款收到的现金                                 | `cash_received_from_borrowings`                |              |
| 3.60     | L2       | 发行债券收到的现金                                 | `cash_received_from_bond_issue`                |              |
| 3.61     | L2       | 收到其他与筹资活动有关的现金                       | `other_cash_received_financing`                |              |
| 3.62     | L2       | 筹资活动现金流入其他项目                           | `inflow_other_items`                           |              |
| 3.63     | L2       | 筹资活动现金流入平衡项目                           | `inflow_balance_items`                         |              |
| 3.64     | L2       | 筹资活动现金流入小计                               | `subtotal_cash_inflow_financing`               |              |
| 3.65     | L2       | 偿还债务支付的现金                                 | `cash_paid_for_debt_repayment`                 |              |
| 3.66     | L2       | 分配股利、利润或偿付利息支付的现金                 | `cash_paid_for_dividends_and_profits`          |              |
| 3.67     | L2       | 子公司支付给少数股东的股利、利润                   | `dividends_paid_to_minority`                   |              |
| 3.68     | L2       | 购买子公司少数股权而支付的现金                     | `cash_paid_for_minority_equity`                |              |
| 3.69     | **L2**   | **支付其他与筹资活动有关的现金**                   | **`other_cash_paid_financing`**                | **子级对象** |
| 3.70     | L3       | 其中：子公司减资支付给少数股东的现金               | `paid_to_minority_for_capital_reduction`       |              |
| 3.71     | L2       | 筹资活动现金流出其他项目                           | `outflow_other_items`                          |              |
| 3.72     | L2       | 筹资活动现金流出平衡项目                           | `outflow_balance_items`                        |              |
| 3.73     | L2       | 筹资活动现金流出小计                               | `subtotal_cash_outflow_financing`              |              |
| 3.74     | L2       | 筹资活动产生的现金流量净额其他项目                 | `net_cash_flow_other_items`                    |              |
| 3.75     | L2       | 筹资活动产生的现金流量净额平衡项目                 | `net_cash_flow_balance_items`                  |              |
| 3.76     | L2       | **筹资活动产生的现金流量净额**                     | **`net_cash_flow_from_financing`**             |              |
| 3.77     | **L1**   | **四、现金及现金等价物净增加**                     | **`cash_increase`**                            | **父级对象** |
| 3.78     | L2       | 汇率变动对现金及现金等价物的影响                   | `exchange_rate_effect`                         |              |
| 3.79     | L2       | 现金及现金等价物净增加额其他项目                   | `increase_other_items`                         |              |
| 3.80     | L2       | 现金及现金等价物净增加额平衡项目                   | `increase_balance_items`                       |              |
| 3.81     | L2       | **现金及现金等价物净增加额**                       | **`net_increase_cash_and_equivalents`**        |              |
| 3.82     | L2       | 期初现金及现金等价物余额                           | `cash_at_beginning`                            |              |
| 3.83     | L2       | 期末现金及现金等价物余额其他项目                   | `end_balance_other_items`                      |              |
| 3.84     | L2       | 期末现金及现金等价物余额平衡项目                   | `end_balance_balance_items`                    |              |
| 3.85     | L2       | **期末现金及现金等价物余额**                       | **`cash_at_end`**                              |              |

#### **4. 补充资料 (Supplementary Info)**

| **序号** | **层级** | **原始中文项目**                               | **英文 Key (JSON)**                          | **说明**     |
| -------- | -------- | ---------------------------------------------- | -------------------------------------------- | ------------ |
| 4.1      | **L1**   | **补充资料**                                   | **`supplementary_info`**                     | **父级对象** |
| 4.2      | **L2**   | **净利润-现金流量表**                          | **`net_profit_adjustment`**                  | **子级对象** |
| 4.3      | L3       | 净利润-现金流量表                              | `net_profit`                                 |              |
| 4.4      | L3       | 资产减值准备                                   | `asset_impairment_reserves`                  |              |
| 4.5      | L3       | 固定资产和投资性房地产折旧                     | `depreciation_fixed_assets_investment_props` |              |
| 4.6      | L3       | 固定资产折旧、油气资产折耗、生产性生物资产折旧 | `depreciation_others`                        |              |
| 4.7      | L3       | 投资性房地产折旧                               | `depreciation_investment_props`              |              |
| 4.8      | L3       | 无形资产摊销                                   | `amortization_intangible_assets`             |              |
| 4.9      | L3       | 长期待摊费用摊销                               | `amortization_long_term_deferred`            |              |
| 4.10     | L3       | 递延收益摊销                                   | `amortization_deferred_revenue`              |              |
| 4.11     | L3       | 待摊费用的减少                                 | `decrease_deferred_expenses`                 |              |
| 4.12     | L3       | 预提费用的增加                                 | `increase_accrued_expenses`                  |              |
| 4.13     | L3       | 处置固定资产、无形资产和其他长期资产的损失     | `loss_disposal_assets`                       |              |
| 4.14     | L3       | 固定资产报废损失                               | `loss_scrapping_assets`                      |              |
| 4.15     | L3       | 公允价值变动损失                               | `loss_fair_value_change`                     |              |
| 4.16     | L3       | 财务费用                                       | `financial_expenses`                         |              |
| 4.17     | L3       | 投资损失                                       | `investment_loss`                            |              |
| 4.18     | L3       | 递延所得税                                     | `deferred_tax`                               |              |
| 4.19     | L3       | 递延所得税资产减少                             | `decrease_deferred_tax_assets`               |              |
| 4.20     | L3       | 递延所得税负债增加                             | `increase_deferred_tax_liabilities`          |              |
| 4.21     | L3       | 预计负债的增加                                 | `increase_estimated_liabilities`             |              |
| 4.22     | L3       | 存货的减少                                     | `decrease_inventories`                       |              |
| 4.23     | L3       | 经营性应收项目的减少                           | `decrease_operating_receivables`             |              |
| 4.24     | L3       | 经营性应付项目的增加                           | `increase_operating_payables`                |              |
| 4.25     | L3       | 其他                                           | `other`                                      |              |
| 4.26     | L3       | 经营活动现金流量净额其他项目                   | `net_cash_flow_other_items`                  |              |
| 4.27     | L3       | 经营活动现金流量净额平衡项目                   | `net_cash_flow_balance_items`                |              |
| 4.28     | **L2**   | **间接法-经营活动产生的现金流量净额**          | **`indirect_method_result`**                 | **子级对象** |
| 4.29     | L3       | 间接法-经营活动产生的现金流量净额              | `net_cash_flow_from_operating_indirect`      |              |
| 4.30     | **L2**   | **不涉及现金收支的重大活动**                   | **`significant_non_cash`**                   | **子级对象** |
| 4.31     | L3       | 债务转为资本                                   | `debt_to_capital`                            |              |
| 4.32     | L3       | 一年内到期的可转换公司债券                     | `convertible_bonds_due_within_1y`            |              |
| 4.33     | L3       | 融资租入固定资产                               | `fixed_assets_finance_lease`                 |              |
| 4.34     | L3       | 不涉及现金收支的投资和筹资活动金额其他项目     | `non_cash_items_other`                       |              |
| 4.35     | **L2**   | **现金及等价物变动情况**                       | **`cash_change_check`**                      | **子级对象** |
| 4.36     | L3       | 现金的期末余额                                 | `cash_end_balance`                           |              |
| 4.37     | L3       | 现金的期初余额                                 | `cash_begin_balance`                         |              |
| 4.38     | L3       | 现金等价物的期末余额                           | `equivalents_end_balance`                    |              |
| 4.39     | L3       | 现金等价物的期初余额                           | `equivalents_begin_balance`                  |              |
| 4.40     | L3       | 现金及现金等价物净增加额其他项目               | `net_increase_other`                         |              |
| 4.41     | L3       | 现金及现金等价物净增加额平衡项目               | `net_increase_balance`                       |              |
| 4.42     | L3       | 间接法-现金及现金等价物的净增加额              | `net_increase_cash_and_equivalents_indirect` |              |
| 4.43     | L3       | 信用减值损失                                   | `credit_impairment_loss`                     |              |

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