import { api } from "../client";
import { endpoints } from "../endpoints";

type ProfitPredictionBody = {
  category: string;
  ship_mode: string;
  state: string;
  cost: number;
  units: number;
  customer_id: string;
}


type ShipModePredictionBody = {
  price: number;
  units: number;
  profit: number;
  category: string;
  city: string;
}


export const getProjects = async () => {
  const { data } = await api.get(endpoints.projects.list);
  return data;
};

export const predictProfit = async (body: ProfitPredictionBody) => {
  const { data } = await api.post(endpoints.projects.predictProfit, body);
  return data;
}

export const predictShip = async (body: ShipModePredictionBody) => {
  const { data } = await api.post(endpoints.projects.predictShip, body);
  return data;
}
