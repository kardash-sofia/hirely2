import { useQuery } from "@tanstack/react-query";
import { getProjects } from '../../../api/services/Projects/projects';
import type { ListResponse } from "../../../api/types";
import type { ProjectItemType } from "../types";
import type { GetProjectsQuery } from "../../../api/services/Projects/types";


export const useGetProjects = (query: GetProjectsQuery) => {
  return useQuery<ListResponse<ProjectItemType>, Error>({
    queryKey: ["projects", query],
    queryFn: () => getProjects(query),
  });
};
