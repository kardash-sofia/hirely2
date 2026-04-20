from pydantic import BaseModel, Field
from typing import List, Optional

class BudgetPredictionRequest(BaseModel):
    title: str = Field(..., min_length=2)
    description: str = Field(..., min_length=5)
    technologies: List[str] = []
    category: str
    complexity: int = Field(..., ge=1, le=5)

class BudgetPredictionResponse(BaseModel):
    estimated_budget: float
    recommended_min: float
    recommended_max: float
    model_version: str
    note: str

class CategoryPredictionRequest(BaseModel):
    title: str = Field(..., min_length=2)
    description: str = Field(..., min_length=5)


class CategoryPredictionResponse(BaseModel):
    predicted_category: str
    model_version: str
    note: str

class GenerateDescriptionRequest(BaseModel):
    title: str = Field(..., min_length=2)
    short_description: str = Field(..., min_length=5)
    category: str
    technologies: List[str] = []
    complexity: int = Field(..., ge=1, le=5)
    predicted_budget: float | None = None

class GenerateDescriptionResponse(BaseModel):
    expanded_description: str
    requirements: List[str]
    deliverables: List[str]
    recommended_skills: List[str]