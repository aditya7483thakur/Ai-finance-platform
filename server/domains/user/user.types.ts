export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type { AuthUserPayload } from "./user.validators.js";

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
  email: string;
};
