import { useQuery } from "@tanstack/react-query";
import { getMe, getUserById } from "../../../api/services/Profile/profiles";
import type { User } from "../../../api/services/Profile/types";

export const useGetProfile = (id?: string) => {
  return useQuery<User, Error>({
    queryKey: ["profile", id],
    queryFn: () =>
      id === "me"
        ? getMe()
        : getUserById(id!),
    enabled: !!id,
  });
};