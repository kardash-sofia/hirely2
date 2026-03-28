import { useMutation, useQuery } from "@tanstack/react-query";
import type { ProjectConstants } from "../types";
import { createProject, getProjectConstants } from "../../../api/services/Projects/projects";

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