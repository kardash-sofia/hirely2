import { useQuery } from "@tanstack/react-query";
import { getPlaceholders } from "../../../api/services/Profile/profiles";

export const useGetPlaceholders = () => {
  return useQuery({
    queryKey: ["profile", "placeholders"],
    queryFn: getPlaceholders,
  });
};
