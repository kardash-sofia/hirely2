import { useMutation } from "@tanstack/react-query";
import {
  generateDescription,
  predictBudget,
  predictCategory,
} from "../../../api/services/AI/ai";

export const useProjectAiAssistant = () => {
  const budgetMutation = useMutation({
    mutationFn: predictBudget,
  });

  const categoryMutation = useMutation({
    mutationFn: predictCategory,
  });

  const descriptionMutation = useMutation({
    mutationFn: generateDescription,
  });

  return {
    predictBudget: budgetMutation.mutateAsync,
    predictCategory: categoryMutation.mutateAsync,
    generateDescription: descriptionMutation.mutateAsync,

    isPredictingBudget: budgetMutation.isPending,
    isPredictingCategory: categoryMutation.isPending,
    isGeneratingDescription: descriptionMutation.isPending,

    budgetResult: budgetMutation.data,
    categoryResult: categoryMutation.data,
    descriptionResult: descriptionMutation.data,
  };
};