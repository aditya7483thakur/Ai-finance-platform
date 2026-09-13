import { emailNodemailerAdapter } from "./shared/integrations/email/email.adapter.nodemailer.js";
import { aiGeminiAdapter } from "./shared/integrations/ai/ai.adapter.gemini.js";
import { bcryptPasswordHasher } from "./shared/integrations/password/password.adapter.bcrypt.js";
import { accountPrismaRepository } from "./domains/account/account.repository.prisma.js";
import { transactionPrismaRepository } from "./domains/transaction/transaction.repository.prisma.js";
import { userPrismaRepository } from "./domains/user/user.repository.prisma.js";
import { AccountService } from "./domains/account/account.service.js";
import { AuthService } from "./domains/auth/auth.service.js";
import { CronService } from "./domains/cron/cron.service.js";
import { GraphService } from "./domains/graph/graph.service.js";
import { TransactionService } from "./domains/transaction/transaction.service.js";
import { UserService } from "./domains/user/user.service.js";

export const accountService = new AccountService(
  accountPrismaRepository,
  userPrismaRepository,
  emailNodemailerAdapter,
);

export const authService = new AuthService(
  userPrismaRepository,
  bcryptPasswordHasher,
);

export const userService = new UserService(
  userPrismaRepository,
  bcryptPasswordHasher,
);

export const graphService = new GraphService(transactionPrismaRepository);

export const transactionService = new TransactionService(
  transactionPrismaRepository,
  accountPrismaRepository,
  aiGeminiAdapter,
  accountService,
);

export const cronService = new CronService(
  transactionPrismaRepository,
  accountPrismaRepository,
  userPrismaRepository,
  aiGeminiAdapter,
  emailNodemailerAdapter,
  accountService,
);
