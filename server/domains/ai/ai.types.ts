export type ReceiptExtractionResult = {
  type?: "INCOME" | "EXPENSE";
  amount?: string;
  category?: string;
  date?: string;
  description?: string;
};
