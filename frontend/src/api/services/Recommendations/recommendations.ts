import { api } from "../../client";
import { endpoints } from "../../endpoints";
import type { RecommendedFreelancer } from "./types";

export const getRecommendedFreelancersForProject = async (
  projectId: string,
  limit = 6
): Promise<RecommendedFreelancer[]> => {
  const { data } = await api.get(
    endpoints.recommendations.freelancersForProject(projectId),
    {
      params: { limit },
    }
  );

  return data;
};
