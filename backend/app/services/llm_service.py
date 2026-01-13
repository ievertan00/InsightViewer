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

    def _get_system_prompt(self, profile: str) -> str:
        base_prompt = """
You are InsightBot, an expert financial analyst. Your goal is to interpret financial data objectively.

**Core Rules:**
1.  **NO MATH:** Do not attempt to calculate ratios. Use the provided data.
2.  **EVIDENCE-BASED:** Every claim must cite a specific data point from the input.
3.  **NEUTRALITY:** Avoid emotional language. Use professional terms.
4.  **UNCERTAINTY:** If data is missing for a section, explicitly state: "Insufficient data to analyze [Metric]."
5.  **FORMAT:** Return the response in strict Markdown format.

**Task:**
Generate a financial analysis report based on the provided JSON context.
"""
        if profile == "executive_summary":
            return base_prompt + "\n**Profile: Executive Summary**\nFocus on high-level strategic insights, top risks, and bottom-line health. Be concise."
        elif profile == "forensic_deep_dive":
            return base_prompt + "\n**Profile: Forensic Deep Dive**\nFocus on anomalies, red flags, accounting discrepancies, and specific risk vectors. Be skeptical and technical."
        elif profile == "health_check":
            return base_prompt + "\n**Profile: Health Check**\nProvide a balanced educational overview of profitability, solvency, and efficiency. Explain what the numbers mean."
        elif profile == "comprehensive_analysis":
            return base_prompt + """
**Profile: Comprehensive Analysis (One for All)**
Combine the following perspectives into a single, structured report:
1.  **Executive Summary:** Start with high-level strategic insights and bottom-line health.
2.  **Financial Health Check:** Provide a balanced overview of profitability, solvency, and efficiency.
3.  **Forensic Deep Dive:** Investigate anomalies, red flags, and risk vectors.

Structure the report clearly with sections for each perspective.
"""
        else: # Default fallback
            return base_prompt + "\n**Profile: Standard Analysis**\nProvide a general financial analysis."

    def _format_user_message(self, context: AnalysisContext) -> str:
        return f"""
Analyze the following company data:

```json
{context.model_dump_json(indent=2)}
```

Structure the output with clear headings (#, ##) corresponding to the profile's needs.
"""

    def _call_gemini_sync(self, system_prompt: str, user_message: str) -> str:
        if not self.gemini_key:
            raise ValueError("GEMINI_API_KEY not set")
        genai.configure(api_key=self.gemini_key)
        # Updated to use available model from list_models.py
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(f"{system_prompt}\n\n{user_message}")
        return response.text

    def _call_deepseek_sync(self, system_prompt: str, user_message: str) -> str:
        if not self.deepseek_key:
            raise ValueError("DEEPSEEK_API_KEY not set")
        client = OpenAI(api_key=self.deepseek_key, base_url="https://api.deepseek.com/v1")
        response = client.chat.completions.create(
            model="deepseek-chat",
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
        system_prompt = self._get_system_prompt(profile)
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