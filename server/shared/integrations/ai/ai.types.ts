export const AI_API_MISSING_ERROR = "AI_API_MISSING";

export type FinancialTipExpenseItem = {
  name: string;
  value: number;
};

export type ExtractReceiptInput = {
  mimeType: string;
  base64Image: string;
};
