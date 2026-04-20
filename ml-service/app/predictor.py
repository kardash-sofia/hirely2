import joblib
import numpy as np
import pandas as pd

class BudgetPredictor:
    def __init__(self, model_path: str):
        self.pipeline = joblib.load(model_path)

    def predict(self, payload: dict) -> dict:
        description = payload.get("description", "") or ""
        title = payload.get("title", "") or ""
        technologies = payload.get("technologies", []) or []

        row = {
            "text": f"{title} {description}".strip(),
            "tech_text": " ".join(technologies),
            "category": payload.get("category", ""),
            "complexity": payload.get("complexity", 1),
            "desc_len": len(description),
            "title_len": len(title),
            "num_tech": len(technologies),
        }

        X = pd.DataFrame([row])
        predicted = self.pipeline.predict(X)[0]
        budget = float(np.expm1(predicted))

        return {
            "estimated_budget": round(budget, 2),
            "recommended_min": round(budget * 0.85, 2),
            "recommended_max": round(budget * 1.15, 2),
            "model_version": "v1",
            "note": "AI-generated estimate for initial budgeting, not a fixed price."
        }
    
class CategoryPredictor:
    def __init__(self, model_path: str):
        self.pipeline = joblib.load(model_path)

    def predict(self, payload: dict) -> dict:
        title = payload.get("title", "") or ""
        description = payload.get("description", "") or ""

        text = f"{title} {description}".strip()

        predicted_category = self.pipeline.predict([text])[0]

        return {
            "predicted_category": str(predicted_category),
            "model_version": "v1",
            "note": "AI-generated category suggestion based on project title and description."
        }