---
name: repository-pattern
description: "Use when generating domain modules in Express.js + TypeScript + Prisma with strict Controller -> Service -> Repository architecture, custom error classes, and production-ready typed code."
---

# Repository Pattern Skill

Generate scalable domain modules for this backend using Express.js, TypeScript, and Prisma.

## Use When

- User asks for domain scaffolding in backend architecture
- User wants strict clean architecture separation
- User wants controller/service/repository files with Prisma
- User asks for production-grade, interview-ready backend module code
- User wants new domains to match the existing `server/domains/user` + `server/shared` patterns

## Required Stack

- Express.js
- TypeScript (strict typing, no `any`)
- Prisma
- ESM-style TypeScript imports with `.js` extension in relative imports

## Canonical Domain File Set

For domain `<domain>` inside `server/domains/<domain>/`:

- `<domain>.constants.ts`
- `<domain>.types.ts`
- `<domain>.repository.ts`
- `<domain>.service.ts`
- `<domain>.controller.ts`
- `<domain>.routes.ts`

Use constants file to remove hardcoded strings from controller/service.

## Strict Architecture Rules

### 1) Controller Layer

- Handle HTTP only (`req`, `res`)
- Call service layer
- Delegate error mapping to shared controller error helper
- Return proper HTTP status codes
- Must not contain business logic
- Must not call Prisma or database directly
- Shape API responses as `{ message, data }` for success
- Remove sensitive fields before response (for example strip `password` from `User`)

Controller pattern (required):

- Wrap every handler in `try/catch`
- On success: return explicit status (`201`, `200`) and message from `<domain>.constants.ts`
- On failure: call `handleControllerError(res, error, <CONTEXT_MESSAGE>)` from `server/shared/utils/controllerError.ts`

### 2) Service Layer

- Contain business logic only
- Validate input and coordinate operations
- Call repository layer
- Return plain domain data
- Throw shared domain errors (do not return HTTP-shaped objects)
- Remain reusable outside HTTP (cron, queues, workers)
- Add explicit TypeScript return types for all exported service methods
- Use message constants for all thrown error messages (no hardcoded text)
- Keep helper functions private in service (payload parsing/normalization)

#### Service Return Contract Strategy (mandatory)

- Services must return typed domain data only (entity or service DTO), never HTTP envelopes.
- Do not return `message` fields.
- Keep return shape consistent across service methods.

### 3) Repository Layer

- Contain database access only
- Use Prisma queries only
- No business logic or validation
- Use strict Prisma and TypeScript types
- Keep one repository function per data access use case (`findById`, `findByEmail`, `create`, `updateById`, `deleteById`)

### 4) Types and Constants Layer

- Define input payload and repository input types in `<domain>.types.ts`
- Define user-facing success and failure message catalogs in `<domain>.constants.ts`
- Export constants with `as const`
- Service/controller must consume these constants instead of inline strings

## Error Handling Rules

- Use shared error classes from `server/shared/types/errors.ts`:
  - `DomainError`
  - `BadRequestError`
  - `NotFoundError`
  - `ConflictError`
- Service throws these errors with constants-based messages
- Controller delegates mapping to `handleControllerError` from `server/shared/utils/controllerError.ts`
- Unknown errors must log context and map to `500`

## Routing Rules

- Keep routes in `<domain>.routes.ts` using `express.Router()`
- Route handlers import only controller functions
- Use explicit route paths and match existing project naming conventions

## Implementation Rules

- Use async/await consistently
- Keep functions small and focused
- Export clear, reusable functions
- Add minimal useful comments only where necessary
- Avoid framework-specific coupling in service/repository
- Prefer strongly typed helper functions over inline complex expressions
- Keep repository/service/controller layering strict (no violations)

## Input Template

```text
Domain: <DOMAIN_NAME>
Prisma Model: <MODEL_NAME>
Fields: <FIELDS>
Operations: <CREATE|READ|UPDATE|DELETE|CUSTOM>
```

## Output Order

1. `<domain>.constants.ts`
2. `<domain>.types.ts`
3. `<domain>.repository.ts`
4. `<domain>.service.ts`
5. `<domain>.controller.ts`
6. `<domain>.routes.ts`

## Output Constraints

- Output code only
- No explanations outside code
- Production-ready style
- Designed for scalability and maintainability
- Must match existing import style and shared-layer integrations used in this repo

## Generation Checklist

- Repository has only Prisma queries
- Service has only business logic and throws shared typed errors
- Controller handles only HTTP mapping and delegates errors via `handleControllerError`
- Service methods use explicit return types and consistent return contracts
- Controller performs all response shaping (messages, envelope, public field filtering)
- No hardcoded response/error strings in controller or service
- Messages are centralized in `<domain>.constants.ts`
- No layer violations
- No `any`
- Types and return contracts are explicit

## Project Learnings (Ai finance platform)

Use these repository-specific conventions when generating or refactoring domains in this workspace:

- Controller must parse and validate transport inputs before calling service:
  - Parse `req.body` into typed DTO inputs in `<domain>.validators.ts`
  - Parse and validate `req.params` (for this codebase, params can be `string | string[]`)
  - Parse and normalize pagination/filter query into a typed parsed object before service call
- Service should accept typed validated inputs (not raw `unknown`) and focus on business invariants + orchestration.
- Keep reusable pure utilities in `<domain>.helper.ts` when they are used in multiple service flows (for example date recurrence math or decimal clamping).
- Repository methods that may run in and out of transactions should accept a union DB client:
  - `type DbClient = typeof prisma | Prisma.TransactionClient`
  - Default to global prisma, but allow passing transaction client from `prisma.$transaction(async (tx) => ...)`
- Keep Prisma decimals in service/repository math paths; avoid converting to JS number for persisted balance/amount calculations.
- Preserve response shaping in controller (`{ message, data }` and optional `pagination`) and delegate error mapping through shared controller error utility.
