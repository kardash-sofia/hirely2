import { useQuery } from "@tanstack/react-query";
import { getMyProjectApplication } from "../../../api/services/Projects/projects";

export const useGetMyProjectApplication = (
  projectId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["project-applications", "mine", projectId],
    queryFn: () => getMyProjectApplication(projectId),
    enabled: !!projectId && enabled,
  });
};
