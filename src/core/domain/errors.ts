export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {}

export class HttpError extends AppError {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Sessão expirada. Entre novamente.") {
    super(message, 401);
  }
}

export class NetworkError extends AppError {
  constructor(message = "Sem conexão com o servidor. Verifique sua internet e tente de novo.") {
    super(message);
  }
}

export const errorMessage = (error: unknown, fallback = "Algo deu errado. Tente novamente.") =>
  error instanceof Error && error.message ? error.message : fallback;

export const isClientError = (error: unknown) =>
  error instanceof HttpError && error.status >= 400 && error.status < 500;
