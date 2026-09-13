export const AI_API_MISSING_ERROR = "AI_API_MISSING";

export type FinancialTipExpenseItem = {
  name: string;
  value: number;
};

export type ExtractReceiptInput = {
  mimeType: string;
  base64Image: string;
};

export type AiReceiptResult = {
  type?: "INCOME" | "EXPENSE";
  amount?: string;
  category?:
    | "SALARY"
    | "INVESTMENTS"
    | "FOOD"
    | "TRANSPORT"
    | "HOUSING"
    | "ENTERTAINMENT"
    | "TRAVEL"
    | "HEALTH"
    | "SHOPPING"
    | "MISCELLANEOUS";
  date?: string;
  description?: string;
};
