import tushare as ts
import pandas as pd

# 1. 初始化
ts.set_token('04c8c28b6e1164e2e4de74c11efb66752678cdfde51688ae309b2411') # 记得替换回你的Token
pro = ts.pro_api()

stock_code = '600519.SH'
period = "20241231"

# 2. 获取利润表
df_income = pro.income(ts_code=stock_code, period=period)
df_bs = pro.balancesheet(ts_code=stock_code, period=period)
df_cf = pro.cashflow(ts_code=stock_code, period=period)

# --- 修正点在此 ---
# 错误写法: df_income[['ts_code', 'end_date', 'total_revenue', 'net_profit']]
# 正确写法: 使用 'n_income' (净利润) 或 'n_income_attr_p' (归母净利润)

# 这里我们展示 'n_income' (净利润)
print(df_bs.info(verbose=True))