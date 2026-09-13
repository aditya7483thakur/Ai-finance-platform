import type { TransactionCategory } from "../../types/category.js";
import type { LedgerEntryType } from "../../types/ledger.js";

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
  type?: `${LedgerEntryType}`;
  amount?: string;
  category?: `${TransactionCategory}`;
  date?: string;
  description?: string;
};
