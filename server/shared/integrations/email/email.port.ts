import type { SendEmailInput } from "./email.types.js";

export type EmailSender = {
  send: (input: SendEmailInput) => Promise<void>;
};
