import { useMutation } from "@tanstack/react-query";
import { createProject } from "../../../api/services/Projects/projects";

export const useCreateProject = () => {
  return useMutation({
    mutationFn: createProject,
  });
}