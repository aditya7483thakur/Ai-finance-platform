import type {
  AiReceiptResult,
  ExtractReceiptInput,
  FinancialTipExpenseItem,
} from "./ai.types.js";

export type AiClient = {
  extractReceipt: (input: ExtractReceiptInput) => Promise<AiReceiptResult>;
  writeTips: (expenses: FinancialTipExpenseItem[]) => Promise<string>;
};
