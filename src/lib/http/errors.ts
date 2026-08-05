export interface ValidationFieldError {
  field: string;
  code?: string;
  message: string;
}

export const SERVICE_UNAVAILABLE_EVENT = 'wc:service-unavailable';

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

export function notifyServiceUnavailable(error: HttpError): void {
  if (
    typeof window === 'undefined' ||
    ![502, 503, 504].includes(error.statusCode)
  ) {
    return;
  }
  window.dispatchEvent(
    new CustomEvent(SERVICE_UNAVAILABLE_EVENT, {
      detail: { statusCode: error.statusCode },
    })
  );
}
