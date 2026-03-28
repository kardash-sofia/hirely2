import { api } from "../../client";
import { endpoints } from "../../endpoints";
import type { LoginBody, RegisterBody } from "./types";

export const login = async (body: LoginBody) => {
  const { data } = await api.post(endpoints.auth.login, body);
  return data;
};

export const register = async (body: RegisterBody) => {
  const { data } = await api.post(endpoints.auth.register, body);
  return data;
}
