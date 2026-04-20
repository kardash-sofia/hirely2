import { api } from "../../client";
import { endpoints } from "../../endpoints";
import type {
  PredictBudgetRequest,
  PredictBudgetResponse,
  PredictCategoryRequest,
  PredictCategoryResponse,
  GenerateDescriptionRequest,
  GenerateDescriptionResponse,
} from "./types";

export const predictBudget = async (
  body: PredictBudgetRequest
): Promise<PredictBudgetResponse> => {
  const { data } = await api.post(endpoints.ai.predictBudget, body);
  return data;
};

export const predictCategory = async (
  body: PredictCategoryRequest
): Promise<PredictCategoryResponse> => {
  const { data } = await api.post(endpoints.ai.predictCategory, body);
  return data;
};

export const generateDescription = async (
  body: GenerateDescriptionRequest
): Promise<GenerateDescriptionResponse> => {
  const { data } = await api.post(endpoints.ai.generateDescription, body);
  return data;
};