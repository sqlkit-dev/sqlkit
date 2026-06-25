export class SQLKITException extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "SQLKITException";
    if (options?.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}