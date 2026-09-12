import type { Account } from "@prisma/client";

export type AuthUserId = string;

export type AuthUserPayload = {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
};

export type CreateUserInput = {
  id?: string;
  email: string;
  name: string;
  imageUrl: string | null;
  password: string;
};

export type UpdateUserInput = {
  email: string;
  name: string;
  imageUrl: string | null;
};

export type UserForMonthlySummary = {
  id: string;
  email: string | null;
  accounts: Account[];
};
