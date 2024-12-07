from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import backend_logic

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/api/get_portfolio_overview")
async def get_portfolio_overview():
    return JSONResponse(content=await backend_logic.get_portfolio_overview())

@app.get("/api/get_asset_allocation")
async def get_asset_allocation():
     return JSONResponse(content=await backend_logic.get_asset_allocation())

@app.get("/api/get_risk_metrics")
async def get_risk_metrics():
         return JSONResponse(content=await backend_logic.get_risk_metrics())

@app.get("/api/get_performance_dashboard")
async def get_performance_dashboard():
         return JSONResponse(content=await backend_logic.get_performance_dashboard())


@app.get("/api/get_compliance_summary")
async def get_compliance_summary():
         return JSONResponse(content=await backend_logic.get_compliance_summary())


@app.get("/api/get_transaction_analysis")
async def get_transaction_analysis():
         return JSONResponse(content=await backend_logic.get_transaction_analysis())


@app.get("/api/get_sector_exposure")
async def get_sector_exposure():
         return JSONResponse(content=await backend_logic.get_sector_exposure())


@app.get("/api/get_geographic_distribution")
async def get_geographic_distribution():
         return JSONResponse(content=await backend_logic.get_geographic_distribution())
