import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelProject,
  completeProject,
  requestProjectRework,
  submitProjectForReview,
} from "../../../api/services/Projects/projects";

const invalidateProject = (
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: string,
) => {
  queryClient.invalidateQueries({ queryKey: ["projects"] });
  queryClient.invalidateQueries({ queryKey: ["projects", "details", projectId] });
  queryClient.invalidateQueries({
    queryKey: ["project-applications", "project", projectId],
  });
  queryClient.invalidateQueries({
    queryKey: ["project-applications", "mine", projectId],
  });
  queryClient.invalidateQueries({ queryKey: ["project-applications", "my"] });
};

export const useSubmitProjectForReview = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => submitProjectForReview(projectId),
    onSuccess: () => invalidateProject(queryClient, projectId),
  });
};

export const useRequestProjectRework = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => requestProjectRework(projectId),
    onSuccess: () => invalidateProject(queryClient, projectId),
  });
};

export const useCompleteProject = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => completeProject(projectId),
    onSuccess: () => invalidateProject(queryClient, projectId),
  });
};

export const useCancelProject = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelProject(projectId),
    onSuccess: () => invalidateProject(queryClient, projectId),
  });
};
