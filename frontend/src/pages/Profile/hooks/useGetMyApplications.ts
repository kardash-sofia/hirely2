import { useQuery } from "@tanstack/react-query";
import { getMyApplications } from "../../../api/services/ProjectApplications/projectApplications";

export const useGetMyApplications = () => {
  return useQuery({
    queryKey: ["project-applications", "my"],
    queryFn: getMyApplications,
  });
};