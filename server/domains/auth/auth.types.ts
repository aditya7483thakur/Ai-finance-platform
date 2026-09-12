import type { Request } from "express";
import type { User } from "../user/user.types.js";

export type { SigninInput, SignupInput } from "./auth.validators.js";

export type AccessTokenPayload = {
  userId: string;
  email: string;
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
