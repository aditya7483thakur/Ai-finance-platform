---
name: repository-pattern
description: "Use when adding or refactoring server domains. This repo uses ports + Prisma adapters + class services with constructor injection. Ports never import Prisma."
---

# Repository Pattern

This backend keeps domain folders flat. Persistence is hidden behind a port. Prisma lives only in adapter files.

## Use When

- Scaffolding or changing a domain under `server/domains/`
- Adding a new table or query
- Deciding whether a domain gets its own Prisma file
- Reviewing a PR that touches services, ports, or repositories

## Layout

```text
server/
  config/prisma.ts                         # Prisma client, DbClient, runInTransaction
  shared/types/errors.ts                   # DomainError, BadRequestError, NotFoundError, ConflictError
  shared/types/persistence.ts              # PersistenceContext (opaque tx handle)
  shared/utils/controllerError.ts          # HTTP error mapping
  domains/<name>/
    <name>.constants.ts
    <name>.types.ts                        # domain types only — no @prisma/client
    <name>.port.ts                         # repository contract — no @prisma/client
    <name>.repository.prisma.ts            # Prisma adapter (owner tables only)
    <name>.helper.ts                       # optional pure helpers
    <name>.validators.ts                   # parse/validate HTTP input
    <name>.service.ts                      # class + singleton
    <name>.controller.ts                   # HTTP only
    <name>.routes.ts
```

Not every domain owns a table. Those domains have **no** `*.port.ts` and **no** `*.repository.prisma.ts`.

| Domain        | Owns tables                         | Prisma adapter? |
| ------------- | ----------------------------------- | --------------- |
| `user`        | `users`                             | yes             |
| `account`     | `accounts`, `scheduledEmail`        | yes             |
| `transaction` | `transactions`                      | yes             |
| `auth`        | none — uses `UserRepository`        | no              |
| `graph`       | none — uses `TransactionRepository` | no              |
| `cron`        | none — uses user/account/transaction ports | no       |

## Layers

### Port (`<name>.port.ts`)

A TypeScript type. This is the persistence contract the service depends on.

- Import only domain types and `PersistenceContext`
- Never import `@prisma/client`
- Never import `DbClient` from `config/prisma.ts`
- Money on the port is `string` (or `number` for inbound write DTOs), never `Prisma.Decimal`
- Optional `ctx?: PersistenceContext` on methods that may run inside `runInTransaction`

```ts
import type { PersistenceContext } from "../../shared/types/persistence.js";
import type { Account, CreateAccountInput } from "./account.types.js";

export type AccountRepository = {
  findAccountById: (
    accountId: string,
    ctx?: PersistenceContext,
  ) => Promise<Account | null>;
  createAccountRecord: (
    data: CreateAccountInput,
    ctx?: PersistenceContext,
  ) => Promise<Account>;
};
```

### Prisma adapter (`<name>.repository.prisma.ts`)

The only file in the domain that may import Prisma.

- Implements the port
- Maps Prisma rows → domain types (`balance.toString()`, pick only the user fields the domain needs)
- Converts domain write values → `Prisma.Decimal` / Prisma enums before `create`/`update`
- Casts `PersistenceContext` to `DbClient` internally
- Queries **only** the tables this domain owns

```ts
const dbOf = (ctx?: PersistenceContext): DbClient => {
  return (ctx as DbClient | undefined) ?? prisma;
};

const toAccount = (row: PrismaAccount): Account => ({
  id: row.id,
  name: row.name,
  balance: row.balance.toString(),
  budget: row.budget === null ? null : row.budget.toString(),
  usedAmount: row.usedAmount.toString(),
  userId: row.userId,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});
```

### Service (`<name>.service.ts`)

A class. Ports are constructor arguments. Wire the Prisma adapter once at the bottom of the same file.

- Business rules and orchestration only
- Talk to `this.accounts` / `this.users` / `this.transactions` (the port)
- Throw shared domain errors (`NotFoundError`, `BadRequestError`, …)
- Return domain data, never `{ message, data }`
- Do not import `@prisma/client` once that domain is decoupled
- Other domains: import the **owner port/adapter**, do not copy queries

```ts
export class AccountService {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly users: UserRepository,
  ) {}

  async getSingle(accountId: string): Promise<Account> {
    const account = await this.accounts.findAccountById(accountId);
    if (!account) {
      throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }
    return account;
  }
}

export const accountService = new AccountService(
  accountPrismaRepository,
  userPrismaRepository,
);
```

### Controller

- HTTP only: parse input, call the **service singleton**, shape `{ message, data }`
- `try/catch` + `handleControllerError(res, error, CONTEXT_MESSAGE)`
- Never import a port, Prisma, or a repository file

### Validators and helpers

- Validators parse `req.body` / `params` / `query` into typed DTOs
- Helpers stay pure (date math, field mapping). No Prisma.

## Ownership Rules

One table → one Prisma adapter file.

- Need a user? Inject `UserRepository`. Do not add `findUserById` to account/transaction.
- Need an account write? Call `AccountRepository.updateAccountAmounts`. Do not `db.account.update` from transaction/cron.
- Aggregations over transactions (`groupBy`) belong on `TransactionRepository`. Graph and cron call that port.
- Cron is an entry point, not an aggregate. It has no repository file.
- Auth is a use-case over users. It has no repository file.

## Transactions

`runInTransaction` from `config/prisma.ts` is the only way to start a transaction.

Services pass the `tx` handle through as `PersistenceContext`. Adapters unwrap it. Ports never mention `Prisma.TransactionClient`.

```ts
await runInTransaction(async (tx) => {
  await this.transactions.createTransactionRecord(input, nextDate, tx);
  await this.accounts.updateAccountAmounts(accountId, balance, usedAmount, tx);
});
```

## Types

- Domain types live in `<name>.types.ts` and do not import Prisma models
- Money on persisted entities is `string`; inbound create/update DTOs may use `number`
- Adapter maps both directions
- Message catalogs live in `<name>.constants.ts` as `as const`

## Adding a New Domain

1. If it owns a table: `types` → `port` → `repository.prisma` → class `Service` + singleton → controller → routes
2. If it does not own a table: `types` → class `Service` that takes owner ports → controller → routes
3. Put new queries on the owner port, not on the caller
4. Keep the Prisma import inside `*.repository.prisma.ts` (and `config/prisma.ts`)

## Checklist

- [ ] Port and domain types have no `@prisma/client` import
- [ ] Prisma queries exist only in the owner `*.repository.prisma.ts`
- [ ] Service is a class; singleton is constructed at the bottom of the service file
- [ ] Controller imports the service singleton only
- [ ] Cross-domain reads/writes go through the owner port
- [ ] Optional transaction argument is `PersistenceContext`, not `DbClient`
- [ ] Adapter maps Prisma rows to domain types
- [ ] Errors are shared classes; strings come from constants
- [ ] No `any`
