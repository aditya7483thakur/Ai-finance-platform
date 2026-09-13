import { TransactionCategory } from "../../types/category.js";
import { LedgerEntryType } from "../../types/ledger.js";
import type { FinancialTipExpenseItem } from "./ai.types.js";

const RECEIPT_CATEGORIES = Object.values(TransactionCategory).join(", ");

export const buildTipsPrompt = (expenses: FinancialTipExpenseItem[]): string => {
  return `
You are a friendly financial advisor. Based on the category-wise monthly spending below, write 2-3 personalized financial tips. Be concise, friendly, and avoid guilt-tripping.

Here is the user's monthly spending:
${expenses.map((item) => `${item.name}: INR ${item.value.toFixed(2)}`).join("\n")}
`;
};

export const buildReceiptPrompt = (): string => {
  return `
You're a smart assistant that extracts fields from receipts.
From the uploaded image, return this object:
{
  "type": "${LedgerEntryType.INCOME}" or "${LedgerEntryType.EXPENSE}",
  "amount": "number as string",
  "category": "One of: ${RECEIPT_CATEGORIES}",
  "date": "yyyy-mm-dd",
  "description": "short merchant or transaction description"
}
If it's not a receipt, return an empty object {}
`;
};
