export interface ValidationFieldError {
  field: string;
  code?: string;
  message: string;
}

export class HttpError extends Error {
  readonly statusCode: number;
  readonly details?: unknown;
  readonly validationErrors?: ValidationFieldError[];

  constructor(
    message: string,
    options: {
      statusCode: number;
      details?: unknown;
      validationErrors?: ValidationFieldError[];
      cause?: unknown;
    }
  ) {
    super(message, { cause: options.cause });
    this.name = 'HttpError';
    this.statusCode = options.statusCode;
    this.details = options.details;
    this.validationErrors = options.validationErrors;
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Network request failed';
}
