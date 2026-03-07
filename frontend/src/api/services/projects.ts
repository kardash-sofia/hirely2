import { api } from "../client";
import { endpoints } from "../endpoints";

export const getProjects = async () => {
  const { data } = await api.get(endpoints.projects.list);
  return data;
};
