import backend from "@/axios-instance";

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  const res = await backend.post("/auth/signup", data);
  return res.data;
};

export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  const res = await backend.post("/auth/signin", data);
  return res.data;
};

export const getMe = async (): Promise<{ user: AuthResponse["user"] }> => {
  const res = await backend.get("/auth/me");
  return res.data;
};
