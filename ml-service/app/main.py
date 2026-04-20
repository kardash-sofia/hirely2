from fastapi import FastAPI, HTTPException
from app.schemas import (
    BudgetPredictionRequest,
    BudgetPredictionResponse,
    CategoryPredictionRequest,
    CategoryPredictionResponse,
    GenerateDescriptionRequest,
    GenerateDescriptionResponse
)
from app.predictor import BudgetPredictor, CategoryPredictor
from app.services.description_generator import generate_project_description

app = FastAPI(title="Hirely AI Service")


budget_predictor = BudgetPredictor("artifacts/budget_model.joblib")
category_predictor = CategoryPredictor("artifacts/category_model.joblib")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict/budget", response_model=BudgetPredictionResponse)
def predict_budget(payload: BudgetPredictionRequest):
    return budget_predictor.predict(payload.model_dump())

@app.post("/predict/category", response_model=CategoryPredictionResponse)
def predict_category(payload: CategoryPredictionRequest):
    return category_predictor.predict(payload.model_dump())

@app.post("/generate/description", response_model=GenerateDescriptionResponse)
def generate_description(payload: GenerateDescriptionRequest):
    try:
        result = generate_project_description(payload.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))