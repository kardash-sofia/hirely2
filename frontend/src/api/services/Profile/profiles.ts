import { api } from "../../client";
import { endpoints } from "../../endpoints";
import type { UpdateProfile } from "./types";

export const getUserById = async (id: string) => {
  const { data } = await api.get(endpoints.profile.userById(id));
  return data;
}

export const getMe = async () => {
  const { data } = await api.get(endpoints.profile.getMe());
  return data;
}

export const getPlaceholders = async () => {
  const { data } = await api.get(endpoints.profile.getPlaceholders());
  return data;
}

export const updateProfile = async (params: {
  id: string;
  body: UpdateProfile;
}) => {
  const { data } = await api.patch(
    endpoints.profile.update(params.id),
    params.body
  );
  return data;
};
