export const truncate = (str: string) => {
  return [str.slice(0, 5), str.slice(-3)].join("...");
};
