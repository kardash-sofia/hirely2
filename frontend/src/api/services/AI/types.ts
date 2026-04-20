export type PredictBudgetRequest = {
  title: string;
  description: string;
  technologies: string[];
  category: string;
  complexity: number;
};

export type PredictBudgetResponse = {
  estimated_budget: number;
  recommended_min: number;
  recommended_max: number;
  model_version: string;
  note: string;
};

export type PredictCategoryRequest = {
  title: string;
  description: string;
};

export type PredictCategoryResponse = {
  predicted_category: string;
  model_version: string;
  note: string;
};

export type GenerateDescriptionRequest = {
  title: string;
  short_description: string;
  category: string;
  technologies: string[];
  complexity: number;
  predicted_budget?: number | null;
};

export type GenerateDescriptionResponse = {
  expanded_description: string;
  requirements: string[];
  deliverables: string[];
  recommended_skills: string[];
};