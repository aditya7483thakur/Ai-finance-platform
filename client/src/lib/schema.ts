import { z } from "zod";

// Enums for your types
const TransactionType = z.enum(["INCOME", "EXPENSE"]);
const TransactionCategory = z.enum([
  "SALARY",
  "INVESTMENTS",
  "FOOD",
  "TRANSPORT",
  "HOUSING",
  "ENTERTAINMENT",
  "TRAVEL",
  "HEALTH",
  "SHOPPING",
  "MISCELLANEOUS",
]);
const RecurringInterval = z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]);

// Base transaction schema
const BaseTransactionSchema = z.object({
  type: TransactionType,
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid monetary amount")
    .transform(Number),
  description: z.string().optional().or(z.literal("")),
  date: z.coerce.date(),
  category: TransactionCategory,
  accountId: z.string(),
  isRecurring: z.boolean(),
  recurringInterval: RecurringInterval.optional().nullable(), // Modified this line
});

// Add conditional validation
export const TransactionSchema = BaseTransactionSchema.refine(
  (data) => {
    if (data.isRecurring) {
      return (
        data.recurringInterval !== null && data.recurringInterval !== undefined
      );
    }
    return true;
  },
  {
    message: "Recurring interval is required when transaction is recurring",
    path: ["recurringInterval"],
  }
);

// Type inference
export type Transaction = z.infer<typeof TransactionSchema>;
