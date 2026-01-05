# Insight Viewer

Insight Viewer is a tool to turn dense Chinese financial filings into readable, comparable, and actionable structures.

## Project Structure

The project is divided into two main components:

### 1. Frontend (`/frontend`)
- **Tech Stack:** Next.js 16 (React), Tailwind CSS, Recharts/Tremor.
- **Responsibility:** User Interface, Visualization, Report Rendering.
- **Run:** `npm run dev` (inside `frontend/`).

### 2. Backend (`/backend`)
- **Tech Stack:** Python (FastAPI), Polars, DuckDB.
- **Responsibility:** Parsing Excel/PDF files, Data Normalization (CAS Standard), Complex Computation, Storage.
- **Run:** `uvicorn app.main:app --reload` (inside `backend/`).

## Getting Started

1.  **Setup Backend:**
    Follow instructions in [backend/README.md](backend/README.md).
    This ensures you have the API and Data Models ready.

2.  **Setup Frontend:**
    Navigate to `frontend/` and run `npm install`.
    Start the dev server: `npm run dev`.

## Data Standard
The project strictly follows the data structure defined in `Data Structure.md`. The backend enforces this schema via Pydantic models.
