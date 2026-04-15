import { api } from "../../client";
import { endpoints } from "../../endpoints";

export const getUserById = async (id: string) => {
  const { data } = await api.get(endpoints.profile.userById(id));
  return data;
}

export const getMe = async () => {
  const { data } = await api.get(endpoints.profile.getMe());
  return data;
}
