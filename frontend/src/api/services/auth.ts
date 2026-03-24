import { api } from "../client";
import { endpoints } from "../endpoints";

type LoginBody = {
  email: string;
  password: string;
}

type RegisterBody = {
  fullName: string;
  role: string;
  email: string;
  password: string;
}

export const login = async (body: LoginBody) => {
  const { data } = await api.post(endpoints.auth.login, body);
  return data;
};

export const register = async (body: RegisterBody) => {
  const { data } = await api.post(endpoints.auth.register, body);
  return data;
}