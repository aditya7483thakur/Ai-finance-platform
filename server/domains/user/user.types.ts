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
