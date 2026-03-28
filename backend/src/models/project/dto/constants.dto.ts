export type ConstantItemDto = {
  id: string;
  name: string;
};

export type ConstantsDto = {
  categories: ConstantItemDto[];
  technologies: ConstantItemDto[];
};
