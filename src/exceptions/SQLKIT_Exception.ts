export class SQLKITException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SQLKITException";
  }
}
