export const toAmount = (value: number | string | null | undefined): number => {
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

export const formatMoney = (value: number | string | null | undefined): string => {
  const amount = toAmount(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatSignedMoney = (
  value: number | string | null | undefined,
  type: "INCOME" | "EXPENSE",
): string => {
  const formatted = formatMoney(Math.abs(toAmount(value)));
  return type === "INCOME" ? `+${formatted}` : `-${formatted}`;
};

export const balanceToneClass = (
  value: number | string | null | undefined,
): string => {
  const amount = toAmount(value);
  if (amount < 0) {
    return "text-error";
  }
  if (amount > 0) {
    return "text-success";
  }
  return "text-foreground";
};

export const formatShortDate = (value: string | Date): string => {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
