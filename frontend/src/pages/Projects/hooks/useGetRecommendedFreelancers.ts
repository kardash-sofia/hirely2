import { useQuery } from "@tanstack/react-query";
import { getRecommendedFreelancersForProject } from "../../../api/services/Recommendations/recommendations";

export const useGetRecommendedFreelancers = (
  projectId: string,
  limit = 6
) => {
  return useQuery({
    queryKey: ["recommendations", "project-freelancers", projectId, limit],
    queryFn: () => getRecommendedFreelancersForProject(projectId, limit),
    enabled: !!projectId,
  });
};
