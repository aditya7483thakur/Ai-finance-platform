import type { PersistenceContext } from "../../shared/types/persistence.js";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserForMonthlySummary,
} from "./user.types.js";

export type UserRepository = {
  findUserByEmail: (
    email: string,
    ctx?: PersistenceContext,
  ) => Promise<User | null>;
  findUserById: (
    userId: string,
    ctx?: PersistenceContext,
  ) => Promise<User | null>;
  createUser: (data: CreateUserInput, ctx?: PersistenceContext) => Promise<User>;
  updateUserById: (
    userId: string,
    data: UpdateUserInput,
    ctx?: PersistenceContext,
  ) => Promise<User>;
  deleteUserById: (userId: string, ctx?: PersistenceContext) => Promise<User>;
  findUsersForMonthlySummary: (
    ctx?: PersistenceContext,
  ) => Promise<UserForMonthlySummary[]>;
};
