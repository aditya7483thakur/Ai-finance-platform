import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "./auth.repository.js";

const SALT_ROUNDS = 10;

const signToken = (payload: { userId: string; email: string }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const signupUser = async (input: {
  name: string;
  email: string;
  password: string;
}) => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    return {
      status: 409,
      body: { error: "User with this email already exists" },
    };
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
  const newUser = await createUser({ ...input, password: hashedPassword });
  const token = signToken({ userId: newUser.id, email: newUser.email });
  const { password: _, ...userWithoutPassword } = newUser;

  return {
    status: 201,
    body: {
      message: "User created successfully",
      user: userWithoutPassword,
      token,
    },
  };
};

export const signinUser = async (input: {
  email: string;
  password: string;
}) => {
  const user = await findUserByEmail(input.email);

  if (!user) {
    return { status: 401, body: { error: "Invalid email or password" } };
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    return { status: 401, body: { error: "Invalid email or password" } };
  }

  const token = signToken({ userId: user.id, email: user.email });
  const { password: _, ...userWithoutPassword } = user;

  return {
    status: 200,
    body: {
      message: "Sign in successful",
      user: userWithoutPassword,
      token,
    },
  };
};

export const getUserProfile = async (userId: string) => {
  const user = await findUserById(userId);

  if (!user) {
    return { status: 404, body: { error: "User not found" } };
  }

  const { password: _, ...userWithoutPassword } = user;
  return { status: 200, body: { user: userWithoutPassword } };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
};
