import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../../../api/services/Profile/profiles";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
  });
};
