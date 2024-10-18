import { ParsingError } from "./error"

export type State<S> = S & {
  unique: number
  error: ParsingError
}

export type Parser<S, A> = (state: State<S>) => A

export * from "./prim"
export * from "./combinator"
export * from "./error"
export * from "./pos"
export * from "./quantifier"
export * from "./expr"

export * from "./string"
export * from "./array"
