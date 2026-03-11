import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import StandardizedReport
from app.api import upload, stock, report
from datetime import datetime

# Load .env file
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=dotenv_path)

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI(title="Insight Viewer API", version="0.1.0")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
    logging.error(f"{request.method} {request.url} - Validation error: {exc_str}")
    content = {'detail': exc.errors(), 'body': exc.body}
    return JSONResponse(content=content, status_code=422)

# Add CORS middleware
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,https://insight-viewer-web.onrender.com").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/v1", tags=["upload"])
app.include_router(stock.router, prefix="/api/v1", tags=["stock"])
app.include_router(report.router, prefix="/api/v1", tags=["report"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Insight Viewer API. Go to /docs for API documentation."}

@app.api_route("/health", methods=["GET", "HEAD"])
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/schema/template", response_model=StandardizedReport)
def get_schema_template():
    """
    Returns an empty, fully structured JSON template adhering to the CAS-aligned schema.
    Useful for frontend testing or understanding the data structure.
    """
    return StandardizedReport()