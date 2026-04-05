import type { Request } from "express";
import type { User } from "@prisma/client";

export type AccessTokenPayload = {
  userId: string;
  email: string;
};

export type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export type SigninInput = {
  email: string;
  password: string;
};

export type CreateAuthUserInput = {
  name: string;
  email: string;
  password: string;
};

export type PublicAuthUser = Omit<User, "password">;

export type AuthSessionData = {
  user: PublicAuthUser;
  token: string;
};

export type AuthenticatedRequest = Request & {
  userId?: string;
  userEmail?: string;
};
