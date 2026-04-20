from app.openai_client import client
from app.config import OPENAI_MODEL
from app.schemas import GenerateDescriptionResponse

def generate_project_description(payload: dict) -> dict:
    technologies = ", ".join(payload.get("technologies", [])) or "Not specified"
    predicted_budget = payload.get("predicted_budget")
    budget_text = str(predicted_budget) if predicted_budget is not None else "Not specified"

    prompt = f"""
You help users create freelance project postings for a freelance marketplace.

Generate a realistic and professional project draft based only on the provided input.

Project input:
- Title: {payload["title"]}
- Short description: {payload["short_description"]}
- Category: {payload["category"]}
- Technologies: {technologies}
- Complexity: {payload["complexity"]}
- Predicted budget: {budget_text}

Rules:
- Write in English
- Keep the expanded description concise but informative (about 120-220 words)
- Do not invent unrealistic scope
- Do not add technologies that are unrelated to the input
- Requirements should be short bullet-style phrases
- Deliverables should be concrete and useful for a freelance project
- Recommended skills should match the category and technologies
- Return structured data only
""".strip()

    response = client.responses.parse(
        model=OPENAI_MODEL,
        input=[
            {
                "role": "system",
                "content": "You generate structured freelance project drafts."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        text_format=GenerateDescriptionResponse
    )

    return response.output_parsed