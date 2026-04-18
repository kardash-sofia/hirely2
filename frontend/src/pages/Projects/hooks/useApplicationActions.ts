import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  acceptProjectApplication,
  rejectProjectApplication,
  withdrawProjectApplication,
} from "../../../api/services/ProjectApplications/projectApplications";

export const useWithdrawProjectApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdrawProjectApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-applications", "my"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useAcceptProjectApplication = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptProjectApplication,
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ["project-applications", "project", projectId],
        });
        queryClient.invalidateQueries({
          queryKey: ["projects", "details", projectId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-applications", "my"] });
    },
  });
};

export const useRejectProjectApplication = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectProjectApplication,
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ["project-applications", "project", projectId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["project-applications", "my"] });
    },
  });
};