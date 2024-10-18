export class ParsingError extends Error {
  constructor(public messages: () => string[]) {
    super()
  }
}

export const empty_error: ParsingError = new ParsingError(() => [])

export function merge_error(
  es0: ParsingError,
  es1: ParsingError
): ParsingError {
  return new ParsingError(() => es0.messages().concat(es1.messages()))
}

export function error(msg: string): ParsingError {
  return new ParsingError(() => [msg])
}

export function eval_error(error: ParsingError): string[] {
  return error.messages()
}
