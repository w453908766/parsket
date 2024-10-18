import { Parser, many, many1 } from "./index"

export function one_or_more<S, A>(
  p: Parser<S, A>
): Parser<S, Array<A>> {
  return many1(p)
}

export function zero_or_more<S, A>(
  p: Parser<S, A>
): Parser<S, Array<A>> {
  return many(p)
}
