---
name: repository-pattern
description: "Use when generating domain modules in Express.js + TypeScript + Prisma with strict Controller -> Service -> Repository architecture, custom error classes, and production-ready typed code."
---

# Repository Pattern Skill

Generate scalable domain modules for Node.js backends using Express.js, TypeScript, and Prisma.

## Use When

- User asks for domain scaffolding in backend architecture
- User wants strict clean architecture separation
- User wants controller/service/repository files with Prisma
- User asks for production-grade, interview-ready backend module code

## Required Stack

- Express.js
- TypeScript (strict typing, no `any`)
- Prisma

## Strict Architecture Rules

### 1) Controller Layer

- Handle HTTP only (`req`, `res`)
- Call service layer
- Map domain/service errors to HTTP responses
- Return proper HTTP status codes
- Must not contain business logic
- Must not call Prisma or database directly

### 2) Service Layer

- Contain business logic only
- Validate input and coordinate operations
- Call repository layer
- Return plain domain data
- Throw errors (do not return HTTP-shaped objects)
- Remain reusable outside HTTP (cron, queues, workers)
- Enforce consistent return contracts across all service methods in a module
- Do not return `message` fields or `{ message, data }` response shapes
- Add explicit TypeScript return types for all exported service methods

#### Service Return Contract Strategy (mandatory)

- Choose one module-wide strategy and apply it to every method:
  - Always return full domain entity, or
  - Always return explicit service DTOs per use case
- If using DTOs, keep DTO style consistent across create/read/update/delete methods
- Never mix entity returns and response-shaped objects in the same service

### 3) Repository Layer

- Contain database access only
- Use Prisma queries only
- No business logic or validation
- Use strict Prisma and TypeScript types

## Error Handling Rules

- Define custom domain errors:
  - `BadRequestError`
  - `NotFoundError`
  - `ConflictError` (when relevant)
- Service throws these errors
- Controller catches and maps to HTTP responses
- Unknown errors map to `500`

## File Naming Rules

For domain `<domain>`:

- `<domain>.repository.ts`
- `<domain>.service.ts`
- `<domain>.controller.ts`
- `<domain>.types.ts` (optional)

## Implementation Rules

- Use async/await consistently
- Keep functions small and focused
- Export clear, reusable functions
- Add minimal useful comments only where necessary
- Avoid framework-specific coupling in service/repository

## Input Template

```text
Domain: <DOMAIN_NAME>
Prisma Model: <MODEL_NAME>
Fields: <FIELDS>
```

## Output Order

1. `repository.ts`
2. `service.ts`
3. `controller.ts`
4. `types.ts` (optional)

## Output Constraints

- Output code only
- No explanations outside code
- Production-ready style
- Designed for scalability and maintainability

## Generation Checklist

- Repository has only Prisma queries
- Service has only business logic and throws typed errors
- Controller handles only HTTP mapping and error translation
- Service methods use explicit return types and consistent return contracts
- Controller performs all response shaping (messages, envelope, public field filtering)
- No layer violations
- No `any`
- Types and return contracts are explicit
