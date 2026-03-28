import { useMutation, useQuery } from "@tanstack/react-query";
import { createProject, getProjectConstants, getProjects, type GetProjectsQuery } from './../api/services/projects';
import type { ListResponse, NamedEntity } from "../api/types";

export enum ProjectStatus {
  OPEN = 'open',
  PENDING_REVIEW = 'pending_review',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type ProjectItemType = {
  id: string;
  title: string;
  description?: string;
  owner: {
    id: string;
    fullName: string;
    email: string;
  };
  budgetMin?: number;
  budgetMax?: number;
  categories: string[];
  status: ProjectStatus;
}

type ProjectConstants = {
  categories: NamedEntity[];
  technologies: NamedEntity[];
}

export const useGetProjects = (query: GetProjectsQuery) => {
  return useQuery<ListResponse<ProjectItemType>, Error>({
    queryKey: ["projects", query],
    queryFn: () => getProjects(query),
  });
};

export const useGetProjectConstants = () => {
  return useQuery<ProjectConstants, Error>({
    queryKey: ["projects", "constants"],
    queryFn: getProjectConstants,
  });
};

export const useCreateProject = () => {
  return useMutation({
    mutationFn: createProject,
  });
}