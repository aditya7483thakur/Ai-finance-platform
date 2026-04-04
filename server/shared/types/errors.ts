export class DomainError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "DomainError";
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends DomainError {
  constructor(message: string) {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, 409);
    this.name = "ConflictError";
  }
}
