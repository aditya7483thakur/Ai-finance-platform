export const validateSignupInput = (input: {
  name?: string;
  email?: string;
  password?: string;
}) => {
  return Boolean(input.name && input.email && input.password);
};

export const validateSigninInput = (input: {
  email?: string;
  password?: string;
}) => {
  return Boolean(input.email && input.password);
};
