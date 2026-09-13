import bcrypt from "bcrypt";
import type { PasswordHasher } from "./password.port.js";

const SALT_ROUNDS = 10;

export const bcryptPasswordHasher: PasswordHasher = {
  hash: (plain) => bcrypt.hash(plain, SALT_ROUNDS),
  compare: (plain, hashed) => bcrypt.compare(plain, hashed),
};
