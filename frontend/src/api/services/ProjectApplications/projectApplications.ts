import { api } from "../../client";
import { endpoints } from "../../endpoints";
import type {
  CreateProjectApplicationDto,
  ProjectApplicationItem,
} from "./types";

export const createProjectApplication = async (
  body: CreateProjectApplicationDto,
): Promise<ProjectApplicationItem> => {
  const { data } = await api.post(endpoints.projectApplications.create, body);
  return data;
};

export const getMyApplications = async (): Promise<ProjectApplicationItem[]> => {
  const { data } = await api.get(endpoints.projectApplications.my);
  return data;
};

export const getProjectApplications = async (
  projectId: string,
): Promise<ProjectApplicationItem[]> => {
  const { data } = await api.get(endpoints.projects.applications(projectId));
  return data;
};

export const withdrawProjectApplication = async (
  id: string,
): Promise<ProjectApplicationItem> => {
  const { data } = await api.patch(endpoints.projectApplications.withdraw(id));
  return data;
};

export const acceptProjectApplication = async (
  id: string,
): Promise<ProjectApplicationItem> => {
  const { data } = await api.patch(endpoints.projectApplications.accept(id));
  return data;
};

export const rejectProjectApplication = async (
  id: string,
): Promise<ProjectApplicationItem> => {
  const { data } = await api.patch(endpoints.projectApplications.reject(id));
  return data;
};