import type { Prisma } from "@prisma/client";

export type CreateAccountInput = {
  userId: string;
  name: string;
  balance: number;
  budget: number | null;
};

export type UpdateAccountInput = {
  id: string;
  name?: string;
  budget?: number | null;
};

export type UpdateAccountData = {
  name?: string;
  budget?: Prisma.Decimal | null;
};
