import { Parser, ParsingError, State, empty_error, error, merge_error } from "./index"

export function pure<S, A>(a: A): Parser<S, A> {
  return (state) => a
}

export function fconst<S, A, B>(p: Parser<S, A>, b: B): Parser<S, B> {
  return (state) => {
    p(state)
    return b
  }
}

export function fmap<S, A, B>(
  f: (a: A) => B,
  pa: Parser<S, A>
): Parser<S, B> {
  return (state) => {
    let a = pa(state)
    return f(a)
  }
}

export function bind<S, A, B>(
  p: Parser<S, A>,
  q: (a: A) => Parser<S, B>
): Parser<S, B> {
  return (state) => {
    const a = p(state)
    return q(a)(state)
  }
}

export function or<S, A, B>(
  p: Parser<S, A>,
  q: Parser<S, B>
): Parser<S, A | B> {
  return (state) => {
    const id = state.unique

    try {
      return p(state)
    } catch (es) {
      if (es instanceof ParsingError) {
        if (state.unique !== id) {
          throw es
        } else {
          state.error = merge_error(state.error, es)
          return q(state)
        }
      } else {
        throw es
      }
    }
  }
}

export function choice<S, A>(ps: Parser<S, A>[]): Parser<S, A> {
  let acc: Parser<S, A> = fail
  for (let i = ps.length; i > 0; i--) {
    acc = or(ps[i - 1], acc)
  }
  return acc
}

export function fail<S, A>(state: State<S>): A {
  throw empty_error
}

export function guard<S>(b: boolean): Parser<S, null> {
  return (state) => {
    if (b) return null
    else throw error("could not satisfy condition")
  }
}

export function nothing<S>(state: State<S>): null {
  return null
}

export function label<S, A>(
  msg: string,
  p: Parser<S, A>
): Parser<S, A> {
  return (state) => {
    let id = state.unique

    try {
      return p(state)
    } catch (es) {
      if (es instanceof ParsingError) {
        if (state.unique === id) {
          throw error(msg)
        } else {
          throw es
        }
      } else {
        throw es
      }
    }
  }
}

export function attempt<S, A>(
  restore: (state: State<S>, back: State<S>) => void,
  backup: (state: State<S>) => State<S>,
  p: Parser<S, A>
): Parser<S, A> {
  return (state) => {
    const back = backup(state)
    try {
      return p(state)
    } catch (messages) {
      restore(state, back)
      throw messages
    }
  }
}
