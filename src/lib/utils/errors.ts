/**
 * Error for code paths that should be unreachable.
 *
 * Used with TypeScript exhaustiveness checking to ensure all cases are handled.
 * When used with a value of a discriminated union, TypeScript will error at
 * compile time if not all cases are covered in a switch statement.
 */
export class UnreachableError extends Error {
  constructor(value: never, message?: string) {
    super(message ? message : `Unreachable code path: ${String(value)}`)
    this.name = "UnreachableError"
  }
}
