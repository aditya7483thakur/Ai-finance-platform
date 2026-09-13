
---

## 1. Composition root + stop importing `accountService`

This is still the biggest LLD gap.

`TransactionService` and `CronService` take ports in the constructor, then call a **global singleton**:

```76:82:server/domains/transaction/transaction.service.ts
    await accountService.sendBudgetAlertIfNeeded({
      account,
      userId: input.userId,
      accountId: input.accountId,
      newUsedAmount: newUsedAmount.toString(),
      type: input.type,
    });
```

Same in cron. Each service file also still does `new XService(..., aiGeminiAdapter)`.

**What to do:** one `server/composition.ts`. Service files export **only the class**. Inject a `BudgetAlerter` (or `AccountService` itself) into transaction/cron.

That is a composition root, not a Factory. A `createUserService()` helper does not fix the singleton leak.

---

## 2. Strategy — the one place it still earns its keep

Two `getNextRecurringDate` functions still exist, with the same switch:

- `transaction.helper.ts` — add one interval  
- `cron.helper.ts` — loop until the date is in the future  

```ts
type RecurringSchedule = { nextFrom: (date: Date) => Date };

const schedules: Record<RecurringInterval, RecurringSchedule> = { ... };

// create/update: schedules[interval].nextFrom(date)
// cron: while (next <= today) next = schedules[interval].nextFrom(next)
```

Adding `BIWEEKLY` should be one map entry, not two switches.

Graph `getDateRangeByFilter` is the same idea, lower urgency (one `switch`, one caller).

Do **not** wrap Gemini in Strategy. The adapter is enough.

---

## 3. Specification for the budget-alert rule

`sendBudgetAlertIfNeeded` still mixes “should we?” with “send + persist”:

```91:126:server/domains/account/account.service.ts
    if (type !== EXPENSE || !budget || !email) return;
    if (used.isLessThan(budget * 0.9)) return;
    if (alreadySentToday) return;
    await this.mailer.send(...)
    await this.accounts.createBudgetAlertSentRecord(...)
```

Extract `shouldSendBudgetAlert(...)` (type, budget, 90%, email present). The “already sent” check stays next to persistence.

Pair that with an injected alerter from (1). You do not need an event bus yet.

---

## 4. `PasswordHasher` port (small Adapter)

`bcrypt` is still imported in both `AuthService` and `UserService` (Clerk users get `hash("auth:" + id)`).

Same rule as Prisma/email: `hash` / `compare` on a port, bcrypt in one adapter. Optional: one shared `toPublicUser` — it is copied in `auth.helper.ts` and `user.controller.ts`.

---

## 5. Production issues (not Gang of Four, still worth doing)

**Cron is unauthenticated**

```38:38:server/app.ts
app.use("/cron", cronRoutes);
```

Anyone who can hit `/cron/run-recurring-transactions` posts transactions and sends mail. Shared secret or IP allowlist.

**One failed recurring row aborts the job**

Monthly summaries wrap each user in `try/catch`. Recurring does not. One missing account / missing `nextRecurringDate` stops the rest.

**`ScheduledEmail` states are unused**

Schema/constants have `PENDING` / `SENT` / `FAILED`. You only write `SENT` after a live send. Outbox + State is useful only if you want retries. Until then, isolate failures per row.

**AI errors are still string-matched**

```280:283:server/domains/transaction/transaction.service.ts
      if (error instanceof Error && error.message === AI_API_MISSING_ERROR) {
```

A small `AiNotConfiguredError extends DomainError` is cleaner than comparing magic strings. Same idea as `NotFoundError`.

---
