import type { Request } from "express";

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserInput = {
  email: string;
  name: string;
  imageUrl: string | null;
  password: string;
};

export type UserForMonthlySummary = {
  id: string;
  email: string;
};

export type AccessTokenPayload = {
  userId: string;
  email: string;
};

export type PublicUser = Omit<User, "password">;

export type UserSessionData = {
  user: PublicUser;
  token: string;
};

export type AuthenticatedRequest = Request & {
  userId?: string;
  userEmail?: string;
};
