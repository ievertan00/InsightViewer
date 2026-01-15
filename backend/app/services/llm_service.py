import os
import json
import asyncio
from typing import List, Dict, Any
import google.generativeai as genai
from openai import OpenAI
from app.models.llm_schemas import AnalysisContext, GeneratedReport, GeneratedReportSection

class LLMService:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.deepseek_key = os.getenv("DEEPSEEK_API_KEY")
        self.qwen_key = os.getenv("DASHSCOPE_API_KEY") or os.getenv("QWEN_API_KEY")

    def _get_system_prompt(self, language: str) -> str:
        return f"""
You are an expert Senior Financial Specialist (CFA/CPA level). Your goal is to provide a deep, professional, and actionable financial analysis based *strictly* on the provided data.

**Target Audience:** Investors.
**Language:** Respond strictly in {language}.

**Core Mandates:**
1.  **Annual-Data-First:** PRIORITIZE data from the most recent Annual period as the primary basis for analysis. Use data from other periods solely for trend confirmation or supporting evidence.
1.  **EVIDENCE-BASED:** Every claim must cite a specific data point.
2.  **FILTER NOISE:** Do not mention metrics that are missing or zero unless they are critical omissions.
3.  **STRUCTURE:** Use clear Markdown headings.
4.  **TONE:** Professional, objective, and authoritative. Avoid fluff.
5.  **NO INVESTMENT ADVICE:** No Investment Advice. No advice on "Buy", "Sell", "Hold". Focus solely on analysis.

**Analysis Framework:**
1.  **Executive Summary:** High-level strategic insights, top risks, and overall health score.
2.  **Profitability & Growth:** Analyze margins, revenue quality, and cost structure.
3.  **Solvency & Liquidity:** Assess debt levels, working capital, and cash flow health.
4.  **Operational Efficiency:** Evaluate asset turnover and management efficiency.
5.  **Risk Assessment:** Highlight active flags, anomalies, and potential downsides.
"""

    def _filter_zeros(self, data: Any) -> Any:
        if isinstance(data, dict):
            cleaned = {}
            for k, v in data.items():
                if v in [0, 0.0, None, ""]:
                    continue
                cleaned_v = self._filter_zeros(v)
                if isinstance(cleaned_v, (dict, list)) and not cleaned_v:
                    continue
                cleaned[k] = cleaned_v
            return cleaned
        elif isinstance(data, list):
            cleaned = []
            for item in data:
                if item in [0, 0.0, None, ""]:
                    continue
                cleaned_item = self._filter_zeros(item)
                if isinstance(cleaned_item, (dict, list)) and not cleaned_item:
                    continue
                cleaned.append(cleaned_item)
            return cleaned
        return data

    def _format_user_message(self, context: AnalysisContext) -> str:
        # Filter zero values from key data structures
        filtered_report = self._filter_zeros(context.full_report)
        filtered_ratios = self._filter_zeros(context.ratios)
        
        # Restrict Ratios and Flags to Annual Data Only
        is_annual = context.period_type == "Annual" or "Annual" in context.fiscal_year
        
        final_ratios = filtered_ratios if is_annual else {}
        final_flags = [f.dict() for f in context.active_flags] if is_annual else []

        # Construct a focused context dictionary
        final_context = {
            "meta": {
                "company": context.company_name,
                "year": context.fiscal_year,
                "period": context.period_type
            },
            "financials": filtered_report,
            "ratios": final_ratios,
            "trends": [t.dict() for t in context.trends],
            "flags": final_flags
        }

        return f"""
Analyze the following company data for {context.company_name}:

```json
{json.dumps(final_context, indent=2, ensure_ascii=False)}
```
"""

    def _call_gemini_sync(self, system_prompt: str, user_message: str) -> str:
        if not self.gemini_key:
            raise ValueError("GEMINI_API_KEY not set")
        genai.configure(api_key=self.gemini_key)
        # Updated to use available model from list_models.py
        model = genai.GenerativeModel('gemini-3-flash-preview')
        response = model.generate_content(f"{system_prompt}\n\n{user_message}")
        return response.text

    def _call_deepseek_sync(self, system_prompt: str, user_message: str) -> str:
        if not self.deepseek_key:
            raise ValueError("DEEPSEEK_API_KEY not set")
        client = OpenAI(api_key=self.deepseek_key, base_url="https://api.deepseek.com/v1")
        response = client.chat.completions.create(
            model="deepseek-reasoner",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        return response.choices[0].message.content

    def _call_qwen_sync(self, system_prompt: str, user_message: str) -> str:
        if not self.qwen_key:
            raise ValueError("QWEN_API_KEY not set")
        client = OpenAI(
            api_key=self.qwen_key, 
            base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
        )
        response = client.chat.completions.create(
            model="qwen-plus",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        return response.choices[0].message.content

    async def generate_report(self, context: AnalysisContext, profile: str, provider: str) -> GeneratedReport:
        system_prompt = self._get_system_prompt(context.language)
        user_message = self._format_user_message(context)
        
        full_markdown = ""
        
        try:
            # Execute blocking calls in a thread pool
            if provider == "gemini":
                full_markdown = await asyncio.to_thread(self._call_gemini_sync, system_prompt, user_message)
            elif provider == "deepseek":
                full_markdown = await asyncio.to_thread(self._call_deepseek_sync, system_prompt, user_message)
            elif provider == "qwen":
                full_markdown = await asyncio.to_thread(self._call_qwen_sync, system_prompt, user_message)
            else:
                raise ValueError(f"Unsupported provider: {provider}")

        except Exception as e:
            return GeneratedReport(
                title="Error Generating Report",
                profile_used=profile,
                model_used=provider,
                sections=[],
                full_markdown=f"Error: {str(e)}",
                verification_notes=["Generation Failed"]
            )

        sections = []
        sections.append(GeneratedReportSection(section_title="Full Report", content_markdown=full_markdown))

        return GeneratedReport(
            title=f"Financial Analysis: {context.company_name}",
            profile_used=profile,
            model_used=provider,
            sections=sections,
            full_markdown=full_markdown,
            verification_notes=[]
        )