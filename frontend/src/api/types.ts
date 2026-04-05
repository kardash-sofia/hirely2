export type ListResponse<T> = {
  items: T[];
  total: number;
};

export type NamedEntity  = {
  id: string;
  name: string;
}
