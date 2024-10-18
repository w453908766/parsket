import { ArrayParser, ArrayState, error, sequence } from "../index"

export function any_token<T, V>(state: ArrayState<T, V>): T {
  return state.consume()
}

export function satisfy<T, V>(f: (t: T) => boolean): ArrayParser<T, V, T> {
  return (state) => {
    const t = state.head()
    if (f(t)) {
      return state.consume()
    } else {
      throw error(`"${t}" is not satisfy predicate`)
    }
  }
}

export function token<T, V>(tok: T): ArrayParser<T, V, T> {
  return (state) => {
    const t = state.head()
    if (t === tok) {
      return state.consume()
    } else {
      throw error(`expecting "${t}"`)
    }
  }
}

export function tokens<T, V>(toks: T[]): ArrayParser<T, V, T[]> {
  const expects = toks.map(token)
  return sequence(expects)
}
