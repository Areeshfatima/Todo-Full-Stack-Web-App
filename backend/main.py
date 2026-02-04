from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from dotenv import load_dotenv
from routes.tasks import router as tasks_router
from routes.auth import router as auth_router
from database import create_db_and_tables

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="FastAPI Secure Multi-User Todo API")

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],  # Frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Expose authorization header for JWT
    expose_headers=["Access-Control-Allow-Origin", "Authorization"]
)

# Include the routers
app.include_router(tasks_router)
app.include_router(auth_router)

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to the FastAPI Secure Multi-User Todo API"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting server on http://0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)