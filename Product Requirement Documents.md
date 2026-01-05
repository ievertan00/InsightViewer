# Product Requirement Documents

**Product Name:** Insight Viewer 
**Target Users:** Personal tool for a few users
**System Language:** Chinese and English

---

## **1. Vision & Objective**

Enable users to **turn dense Chinese financial filings into readable, comparable, and actionable structures**.  
The platform should:

- Normalize and compute financial data (A-share, H-share, private companies)
  
- Visualize key relationships and cash flows
  
- Highlight strengths and weaknesses with predefined signals
  
- Provide structured interpretation using a reasoning model
  
- Export analysis as PDF or Markdown for record-keeping
  
- Keep data secure, local, and private
  

> Note: Not a fraud detection system — purely a **clarity engine**.

---

## **2. User Stories**

1. **As a user**, I want to upload a financial report so that it is **structured and normalized** automatically.
   
2. **As a user**, I want to view **computed metrics, ratios, and trends** in both numbers and charts.
   
3. **As a user**, I want **predefined signals** (🚩 and ✅) to guide attention but retain the ability to **edit them**.
   
4. **As a user**, I want to **export reports** with both charts and text in **PDF or Markdown**.
   
5. **As a user**, I want a **web login** to ensure only authorized access.
   
6. **As a user**, I want the system to be **compatible with desktop and mobile** devices.
   
7. **As a user**, I want **contextual reasoning** that explains signals, trade-offs, and prompts further diligence.
   

---

## **3. Functional Requirements**

### **3.1 Data Ingestion & Normalization**

- Support A-share, H-share, and private-company filings
  
- Parse Excel, CSV, or native disclosures
  
- Normalize to **CAS-aligned JSON schema**
  
- Explicitly flag unclear or missing data
  
- Future scope: add non-standard disclosures
  

### **3.2 Computation & Processing**

- Compute key ratios (profitability, leverage, cash conversion, working-capital efficiency)
  
- Generate balance-sheet linkages and trend decompositions
  
- Deterministic, reversible calculations using **Polars/NumPy**
  

### **3.3 Signals & Screening**

- Predefined Red Flags (🚩) and Green Flags (✅)
  
- Editable rules for users
  
- No scoring yet; purely **guiding attention**
  
- Future scope: numerical scoring system
  

### **3.4 Visualization**

- Core charts (must-have list TBD)
  
- Interactive dashboards for exploration
  
- Static exports (PDF / Markdown)
  
- Deterministic rendering pipeline, no narrative bias
  

### **3.5 Interpretation (Reasoning Layer)**

**Purpose:** Provide context and guided analysis without replacing user judgment.  
Leverages a reasoning model (e.g., DeepSeek-R1) to generate structured, plain-language insights from computed data.

**Core Functions:**

1. **Company Summary**
   
    - ~200-word business model overview
      
    - Key financial characteristics
      
    - Primary value drivers and risks
    
2. **Signal Explanations**
   
    - For each triggered signal (🚩 or ✅):
      
        - Plain-language context
          
        - Trade-offs and alternative explanations
          
        - Questions for further diligence
          
        - Related financial metrics to examine
          

**Example Output: High Cash, High Debt Signal**

```
### High Cash, High Debt Signal

**What We See:**
The company holds ¥1.2B in cash while carrying ¥800M in short-term debt at 8% interest.

**Possible Explanations:**
1. Cash is restricted (e.g., deposits for projects, regulatory requirements)
2. Cash is held in subsidiaries without upstream mobility
3. Timing mismatch between capital raising and deployment
4. Conservative liquidity management in uncertain environment

**Questions to Investigate:**
- What portion of cash is restricted? (Check notes)
- Are there debt covenants limiting cash use?
- What is the cash held at subsidiary vs. parent level?
- Is there an upcoming large CapEx or M&A plan?

**Comparable Companies:**
Sector median: 2.5x cash-to-debt ratio vs. this company's 1.5x
```

**Design Principles:**

- Neutral, context-driven (no verdict)
  
- Structured output for export (PDF/Markdown)
  
- Highlights trade-offs and investigation prompts
  
- Directly derived from deterministic computations
  

---

### **3.6 Reporting & Export**

- Export fully self-contained report with:
  
    - Structured numbers
      
    - Charts
      
    - Reasoning outputs (optional for MVP)
    
- Formats: **PDF or Markdown**
  

### **3.7 Security & Access**

- Web app with login control
  
- Data flows through the app only; not stored permanently on cloud
  
- Sensitive data remains local
  

### **3.8 Platform Compatibility**

- Web app primary
  
- Desktop & mobile compatibility (responsive UI or wrapper apps)
  

---

## **4. Technical Requirements**

| Layer           | Tech Stack                              | Purpose                                       |
| --------------- | --------------------------------------- | --------------------------------------------- |
| Backend         | FastAPI + Polars                        | Deterministic analytics                       |
| Database        | DuckDB (temporary, in-memory preferred) | Fast querying during session                  |
| Frontend        | Next.js + Tremor                        | Dense, clarity-first dashboards               |
| Visualization   | Deterministic rendering pipeline        | Charts & graphs from structured data          |
| Data Sources    | AkShare / CSMAR / Tushare               | Chinese financial data                        |
| Reasoning Layer | DeepSeek-R1                             | Structured, neutral interpretation of signals |
| Export          | PDF / Markdown generation library       | Static report creation                        |

---

## **5. Architecture & Workflow**

1. **Upload → Parse**
   
    - User uploads a report → structured JSON
    
2. **Process → Compute**
   
    - Ratios, trends, linkages
    
3. **Screen → Signal**
   
    - Highlight red/green flags (editable)
    
4. **Visualize → Explore**
   
    - Interactive dashboards + charts
    
5. **Interpret → Reason**
   
    - Optional reasoning layer produces summaries, explanations, and questions
    
6. **Export → Save**
   
    - PDF/Markdown report containing numbers, charts, and text
      

> Reasoning layer is modular; core analytics remain functional without it.

---

## **6. MVP Scope**

- Core ingestion, normalization, computation, visualization, and static export
  
- Predefined signals with edit capability
  
- Web login + local data handling
  
- Desktop & mobile-friendly design
  
- Optional reasoning layer: included as structured but can be simplified for MVP
  

---

## **7. Future Enhancements**

- Expand data coverage (non-standard disclosures, ESG, bonds)
  
- Numerical scoring system for signals
  
- Real-time processing and alerting
  
- Full DeepSeek-R1 reasoning integration
  
- Export to Excel or integrate with notebooks / BI tools
  
- Advanced user permissions for multi-user setup
  

---

