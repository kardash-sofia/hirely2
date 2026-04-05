import { api } from "../../client";
import { endpoints } from "../../endpoints";
import type { CreateProjectType, GetProjectsQuery } from "./types";

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

export const getProjectById = async (id: string) => {
  const { data } = await api.get(endpoints.projects.byId(id));
  return data;
}

export const getProjectConstants = async () => {
  const { data } = await api.get(endpoints.projects.constants);
  return data;
}

export const createProject = async (body: CreateProjectType) => {
  const { data } = await api.post(endpoints.projects.create, body);
  return data;
}
