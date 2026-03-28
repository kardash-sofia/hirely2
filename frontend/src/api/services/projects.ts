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

export type GetProjectsQuery = {
  limit?: number;
  offset?: number;
  status?: string;
  categories?: string[];
}

export type CreateTaskType = {
  title: string;
  description: string;
  priority: number;
  dueDate: string;
}

export type CreateProjectType = {
  title: string;
  description?: string;
  budgetMin?: number;
  budgetMax?: number;
  categoryIds: string[];
  technologyIds: string[];
  tasks: CreateTaskType[];
}

export const getProjects = async (query: GetProjectsQuery) => {
  const params = new URLSearchParams();

  if (query.limit) params.append("limit", query.limit.toString());
  if (query.offset) params.append("offset", query.offset.toString());
  if (query.status) params.append("status", query.status);
  if (query.categories?.length) {
    query.categories.forEach(cat => params.append("categories", cat));
  }

  const { data } = await api.get(endpoints.projects.list, { params });
  return data;
};

export const getProjectConstants = async () => {
  const { data } = await api.get(endpoints.projects.constants);
  return data;
}

export const predictProfit = async (body: ProfitPredictionBody) => {
  const { data } = await api.post(endpoints.projects.predictProfit, body);
  return data;
}

export const predictShip = async (body: ShipModePredictionBody) => {
  const { data } = await api.post(endpoints.projects.predictShip, body);
  return data;
}

export const createProject = async (body: CreateProjectType) => {
  const { data } = await api.post(endpoints.projects.create, body);
  return data;
}
