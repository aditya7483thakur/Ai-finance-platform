export type AuthUserId = string;

export type AuthEmailAddress = {
  email_address: string;
};

export type AuthUserPayload = {
  id: string;
  email_addresses: AuthEmailAddress[];
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
};

export type CreateUserInput = {
  id: string;
  email: string;
  name: string;
  imageUrl: string | null;
  password: string;
};

export type UpdateUserInput = {
  email: string;
  name: string;
  imageUrl: string | null;
};
