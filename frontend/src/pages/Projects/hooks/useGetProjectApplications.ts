import { useQuery } from "@tanstack/react-query";
import { getProjectApplications } from "../../../api/services/ProjectApplications/projectApplications";

export const useGetProjectApplications = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: ["project-applications", "project", projectId],
    queryFn: () => getProjectApplications(projectId),
    enabled: !!projectId && enabled,
  });
};