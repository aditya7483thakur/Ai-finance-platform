export const hasCreateAccountRequiredFields = (input: {
  userId?: string;
  name?: string;
}) => {
  return Boolean(input.userId && input.name);
};
