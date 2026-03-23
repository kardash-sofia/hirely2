import { useMutation } from "@tanstack/react-query";
import { predictProfit, predictShip } from "../api/services/projects";

export const useProfitPrediction = () => {
  return useMutation({
    mutationFn: predictProfit,
  });
};

export const useShipPrediction = () => {
  return useMutation({
    mutationFn: predictShip,
  });
};