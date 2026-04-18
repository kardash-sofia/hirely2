import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProjectApplication } from "../../../api/services/ProjectApplications/projectApplications";

export const useCreateProjectApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProjectApplication,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["project-applications", "project", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-applications", "my"],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", "details", variables.projectId],
      });
    },
  });
};