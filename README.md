# Insight Viewer

**Insight Viewer** is a specialized financial analysis tool designed to transform dense Chinese financial filings into clear, comparable, and actionable insights. It bridges the gap between raw data and decision-making by standardizing financial reports into a unified structure.

## 🚀 Key Features

- **Data Standardization**: Automatically maps various financial report formats to a standardized CAS (Chinese Accounting Standards) structure.
- **Interactive Visualization**: Visualize trends in Revenue, Net Profit, Cash Flow, and more with dynamic charts.
- **Financial Ratios**: Calculate and track key performance indicators (KPIs) like Gross Margin, ROE, and Debt-to-Asset ratios.
- **Risk Detection (Flags)**: Automated forensic checks to highlight potential "Red Flags" (Risks) and "Green Flags" (Health Signals) in financial statements.
- **AI-Powered Insights**: Leverage AI to generate summaries and deeper analysis of financial data.
- **Excel/JSON Support**: Import data easily from standard Excel templates or JSON files.

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Utilities**: `xlsx` (Excel parsing), `clsx`, `tailwind-merge`

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Data Processing**: [Polars](https://pola.rs/) / [Pandas](https://pandas.pydata.org/)
- **Validation**: [Pydantic](https://docs.pydantic.dev/)
- **Server**: Uvicorn

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v18 or higher recommended.
- **Python**: v3.9 or higher.

### 1. Backend Setup

The backend handles file parsing, validation, and API services.

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    # Windows
    python -m venv venv
    venv\Scripts\activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Start the backend server:
    ```bash
    uvicorn app.main:app --reload
    ```
    The API will run at `http://localhost:8000`.

### 2. Frontend Setup

The frontend provides the user interface for interaction.

1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install Node dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and visit `http://localhost:3000`.

## 📂 Project Structure

```
InsightViewer/
├── backend/                # Python FastAPI backend
│   ├── app/
│   │   ├── api/            # API Route handlers
│   │   ├── core/           # Core configs and mappings
│   │   ├── models/         # Pydantic data schemas
│   │   ├── services/       # Business logic (Parsing, Analysis)
│   │   └── main.py         # Application entry point
│   └── requirements.txt
│
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App Router pages (Import, Flags, Charts, etc.)
│   │   ├── components/     # Reusable UI components
│   │   └── lib/            # Utility functions and types
│   ├── public/             # Static assets (Templates, Icons)
│   └── package.json
│
├── StandardTemplates/      # Excel templates for data import
├── Data Structure.md       # Definition of the standardized data schema
└── README.md               # Project documentation
```

## 📝 Usage Workflow

1.  **Import Data**: Go to the **Data Import** page. Download a standard Excel template (Balance Sheet, Income Statement, Cash Flow), fill it with your data, and upload it.
2.  **Explore**: Use **Data Explorer** to view the raw standardized numbers.
3.  **Analyze**:
    -   Check **Flags** for automated risk assessment.
    -   View **Ratios** for deep financial health analysis.
    -   Visualize trends in **Charts**.

## 📄 License

[Proprietary / Private] - See repository settings for details.