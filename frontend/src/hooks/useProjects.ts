import { useQuery } from "@tanstack/react-query";
import { getProjects } from './../api/services/projects';
import type { ListResponse } from "../api/types";
import type { ProductItemType } from "../pages/Home/tabs/ProductItem";

export const useProjects = () => {
  return useQuery<ListResponse<ProductItemType>, Error>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};