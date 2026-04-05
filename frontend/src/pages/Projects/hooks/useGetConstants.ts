import { useQuery } from "@tanstack/react-query";
import { getProjectConstants } from "../../../api/services/Projects/projects";
import type { ProjectConstants } from "../types";

export const useGetConstants = () => {
  return useQuery<ProjectConstants, Error>({
    queryKey: ["projects", "constants"],
    queryFn: getProjectConstants,
  });
};