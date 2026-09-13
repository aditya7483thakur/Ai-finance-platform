import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../shared/types/errors.js";
import type { PasswordHasher } from "../../shared/integrations/password/password.port.js";
import { AUTH_ERROR_MESSAGES } from "./auth.constants.js";
import type {
  AccessTokenPayload,
  AuthSessionData,
  SigninInput,
  SignupInput,
} from "./auth.types.js";
import {
  signToken,
  toPublicUser,
  verifyAccessTokenPayload,
} from "./auth.helper.js";
import type { UserRepository } from "../user/user.port.js";

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly passwords: PasswordHasher,
  ) {}

  async signup(input: SignupInput): Promise<AuthSessionData> {
    const existingUser = await this.users.findUserByEmail(input.email);

    if (existingUser) {
      throw new ConflictError(AUTH_ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await this.passwords.hash(input.password);
    const newUser = await this.users.createUser({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      imageUrl: null,
    });
    const token = signToken({ userId: newUser.id, email: newUser.email });
    const user = toPublicUser(newUser);

    return { user, token };
  }

  async signin(input: SigninInput): Promise<AuthSessionData> {
    const user = await this.users.findUserByEmail(input.email);

    if (!user) {
      throw new BadRequestError(AUTH_ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
    }

    const isPasswordValid = await this.passwords.compare(
      input.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestError(AUTH_ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
    }

    const token = signToken({ userId: user.id, email: user.email });
    const publicUser = toPublicUser(user);

    return { user: publicUser, token };
  }

  async getUserProfile(userId: string) {
    const user = await this.users.findUserById(userId);

    if (!user) {
      throw new NotFoundError(AUTH_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return toPublicUser(user);
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return verifyAccessTokenPayload(token);
  }
}
