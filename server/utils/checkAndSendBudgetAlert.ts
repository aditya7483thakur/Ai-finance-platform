import { Prisma } from "@prisma/client";
import prisma from "./prisma.js";
import { sendEmail } from "./sendEmail.js";

export default async function checkAndSendBudgetAlert({
  account,
  userId,
  accountId,
  newUsedAmount,
  type,
}) {
  if (
    type === "EXPENSE" &&
    account.budget &&
    newUsedAmount.gte(new Prisma.Decimal(account.budget).mul(0.9))
  ) {
    const today = new Date();
    const alreadySent = await prisma.scheduledEmail.findFirst({
      where: {
        accountId,
        type: "BUDGET_ALERT",
        createdAt: {
          gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        },
      },
    });

    if (!alreadySent) {
      await sendEmail({
        to: account.user.email,
        subject: `⚠️ Budget Alert for ${account.name}`,
        html: `Hi ${
          account.user.name || "there"
        },<br/><br/>You've used over 90% of your budget for <strong>${
          account.name
        }</strong>.<br/>Try to hold back a bit to avoid going over!`,
      });

      await prisma.scheduledEmail.create({
        data: {
          userId,
          accountId,
          type: "BUDGET_ALERT",
          status: "SENT",
        },
      });
    }
  }
}
