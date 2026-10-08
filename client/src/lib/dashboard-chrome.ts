export const dashControl =
  "h-8 cursor-pointer rounded-lg border border-white/10 bg-transparent px-3 text-xs font-medium text-muted-foreground shadow-none hover:bg-white/5 hover:text-foreground";

export const dashSelect =
  "h-8 cursor-pointer rounded-lg border-white/10 bg-white/[0.03] px-2.5 text-xs text-muted-foreground shadow-none hover:bg-white/5";

// Height for toolbar fields (search, selects, date pickers) so filter rows
// line up across pages. The data-size variant beats the Select's own h-9.
export const dashFieldHeight = "h-10 data-[size=default]:h-10";

export const dashLink =
  "cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground";

export const transactionsHref = (accountId?: string | null) =>
  accountId
    ? `/dashboard/transactions?accountId=${encodeURIComponent(accountId)}`
    : "/dashboard/transactions";
