export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export type BudgetAlertEmailInput = {
  userName: string | null;
  accountName: string;
};

export type MonthlySummaryExpenseItem = {
  name: string;
  value: number;
};

export type MonthlySummaryEmailInput = {
  expenses: MonthlySummaryExpenseItem[];
  month: string;
  year: number;
  tip: string;
};
