import { useQuery } from "@tanstack/react-query";
import type { ProjectDetails } from "../types";
import { getProjectById } from "../../../api/services/Projects/projects";

export const useGetProjectDetails = (id: string) => {
  console.log("Fetching project details for ID:", id);
  return useQuery<ProjectDetails, Error>({
    queryKey: ["projects", "details", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
};