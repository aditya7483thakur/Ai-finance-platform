import type {
  ExtractReceiptInput,
  FinancialTipExpenseItem,
} from "./ai.types.js";

export type AiClient = {
  extractReceipt: (input: ExtractReceiptInput) => Promise<string>;
  writeTips: (expenses: FinancialTipExpenseItem[]) => Promise<string>;
};
