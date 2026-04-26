import { api } from "../../client";
import { endpoints } from "../../endpoints";
import type { AdminDashboard } from "../../../pages/Admin/types";

export const getAdminDashboard = async (): Promise<AdminDashboard> => {
  const { data } = await api.get(endpoints.admin.dashboard);
  return data;
};
