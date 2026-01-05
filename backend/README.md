# Insight Viewer - Backend

This is the backend for the Insight Viewer application, built with **FastAPI** and **Polars**.
It handles the parsing, normalization, and analysis of Chinese financial reports.

## Prerequisites

- Python 3.9+
- pip

## Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment (recommended):
    ```bash
    python -m venv venv
    # Windows:
    venv\Scripts\activate
    # Linux/Mac:
    source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Server

Start the development server with hot-reloading:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
API Documentation (Swagger UI) is available at `http://localhost:8000/docs`.

## Project Structure

- `app/main.py`: Entry point.
- `app/models/schemas.py`: Pydantic models enforcing the CAS-aligned data structure.
- `app/services/`: Business logic (Parsing, Computation).
- `app/api/`: API route handlers.
