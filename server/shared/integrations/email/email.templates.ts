import type {
  BudgetAlertEmailInput,
  MonthlySummaryEmailInput,
} from "./email.types.js";

export const buildBudgetAlertEmail = ({
  userName,
  accountName,
}: BudgetAlertEmailInput): { subject: string; html: string } => {
  return {
    subject: `Budget Alert for ${accountName}`,
    html: `Hi ${
      userName || "there"
    },<br/><br/>You've used over 90% of your budget for <strong>${accountName}</strong>.<br/>Try to hold back a bit to avoid going over!`,
  };
};

export const buildMonthlySummaryEmail = ({
  expenses,
  month,
  year,
  tip,
}: MonthlySummaryEmailInput): { subject: string; html: string } => {
  return {
    subject: `Your ${month} Summary + Tip from Budgetly`,
    html: `
    <h2>Your ${month} ${year} Expense Summary</h2>
    <ul>
      ${expenses
        .map(
          (item) =>
            `<li><strong>${item.name}</strong>: $${item.value.toFixed(2)}</li>`,
        )
        .join("")}
    </ul>
    <h3>Smart Tip:</h3>
    <p>${tip}</p>
    <br/>
    <em>Stay financially wise with Budgetly</em>
  `,
  };
};
