export const formatLabel = (value: string) => {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());
};

export const formatCurrency = (value: number) => {
  return `$${value.toLocaleString("en-US")}`;
};
