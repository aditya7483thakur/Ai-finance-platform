export const isValidGraphFilter = (filter: string) => {
  return ["last_7_days", "last_month", "last_6_months"].includes(filter);
};
