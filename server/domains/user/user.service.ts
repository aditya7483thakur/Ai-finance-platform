import bcrypt from "bcrypt";
import { type AuthUserPayload, type User } from "./user.types.js";
import { ConflictError, NotFoundError } from "../../shared/types/errors.js";
import { USER_ERROR_MESSAGES } from "./user.constants.js";
import type { UserRepository } from "./user.port.js";
import { userPrismaRepository } from "./user.repository.prisma.js";

const getNameFromAuthPayload = (firstName?: string, lastName?: string) => {
  return firstName ? `${firstName} ${lastName || ""}`.trim() : "Unknown User";
};

export class UserService {
  constructor(private readonly users: UserRepository) {}

  async createAuthUser(payload: AuthUserPayload): Promise<User> {
    const email = payload.email;

    const existingById = await this.users.findUserById(payload.id);
    if (existingById) {
      throw new ConflictError(USER_ERROR_MESSAGES.USER_ALREADY_EXISTS_WITH_ID);
    }

    const existingByEmail = await this.users.findUserByEmail(email);
    if (existingByEmail) {
      throw new ConflictError(
        USER_ERROR_MESSAGES.USER_ALREADY_EXISTS_WITH_EMAIL,
      );
    }

    const placeholderPassword = await bcrypt.hash(`auth:${payload.id}`, 10);

    return this.users.createUser({
      id: payload.id,
      email,
      name: getNameFromAuthPayload(
        payload.first_name || undefined,
        payload.last_name || undefined,
      ),
      imageUrl: payload.image_url || null,
      password: placeholderPassword,
    });
  }

  async updateAuthUser(payload: AuthUserPayload): Promise<User> {
    const existingUser = await this.users.findUserById(payload.id);
    if (!existingUser) {
      throw new NotFoundError(USER_ERROR_MESSAGES.USER_NOT_FOUND_IN_DATABASE);
    }

    return this.users.updateUserById(payload.id, {
      email: payload.email,
      name: getNameFromAuthPayload(
        payload.first_name || undefined,
        payload.last_name || undefined,
      ),
      imageUrl: payload.image_url || null,
    });
  }

  async deleteAuthUser(userId: string): Promise<User> {
    const existingUser = await this.users.findUserById(userId);
    if (!existingUser) {
      throw new NotFoundError(USER_ERROR_MESSAGES.USER_NOT_FOUND_IN_DATABASE);
    }

    return this.users.deleteUserById(userId);
  }

  async getAuthUser(userId: string): Promise<User> {
    const userData = await this.users.findUserById(userId);
    if (!userData) {
      throw new NotFoundError(USER_ERROR_MESSAGES.NO_USER_FOUND);
    }

    return userData;
  }
}

export const userService = new UserService(userPrismaRepository);
