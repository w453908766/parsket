import { Parser, choice, fmap, or, pure } from "./index"

export function seq<S, A, B>(
  p: Parser<S, A>,
  q: Parser<S, B>
): Parser<S, [A, B]> {
  return (state) => {
    let r0 = p(state)
    let r1 = q(state)
    return [r0, r1]
  }
}

export function seq0<S, A, B>(
  p: Parser<S, A>,
  q: Parser<S, B>
): Parser<S, A> {
  return (state) => {
    let r0 = p(state)
    let r1 = q(state)
    return r0
  }
}

export function seq1<S, A, B>(
  p: Parser<S, A>,
  q: Parser<S, B>
): Parser<S, B> {
  return (state) => {
    let r0 = p(state)
    let r1 = q(state)
    return r1
  }
}

export function sequence<S, A>(ps: Parser<S, A>[]): Parser<S, A[]> {
  return (state) => {
    let arr = []
    for (let p of ps) {
      arr.push(p(state))
    }
    return arr
  }
}

export function option<S, A>(p: Parser<S, A>): Parser<S, A[]> {
  return or(
    fmap((x) => [x], p),
    pure([])
  )
}

export function option_default<S, A>(
  a: A,
  p: Parser<S, A>
): Parser<S, A> {
  return or(p, pure(a))
}

export function many1<S, A>(p: Parser<S, A>): Parser<S, A[]> {
  return (state) => {
    let arr = []
    arr.push(p(state))
    while (true) {
      let mx = option(p)(state)
      if (mx.length === 0) {
        return arr
      } else {
        arr.push(mx[0])
      }
    }
  }
}

export function many<S, A>(p: Parser<S, A>): Parser<S, A[]> {
  return or(many1(p), pure([]))
}

export function sep_by<S, A, B>(
  p: Parser<S, A>,
  sep: Parser<S, B>
): Parser<S, A[]> {
  return or(sep_by1(p, sep), pure([]))
}

export function sep_by1<S, A, B>(
  p: Parser<S, A>,
  sep: Parser<S, B>
): Parser<S, A[]> {
  return (state) => {
    let v = p(state)
    let vs = many(seq1(sep, p))(state)
    return [v].concat(vs)
  }
}

export function cross<S, A, B>(
  p: Parser<S, A>,
  q: Parser<S, B>
): Parser<S, [A[], B[]]> {
  return (state) => {
    let arr = []
    let brr = []
    while (true) {
      let ma = option(p)(state)
      if (ma.length === 0) {
        return [arr, brr]
      } else {
        arr.push(ma[0])
        let mb = option(q)(state)
        if (mb.length === 0) {
          return [arr, brr]
        } else {
          brr.push(mb[0])
        }
      }
    }
  }
}

export function between<S, Op, Cl, A>(
  open: Parser<S, Op>,
  close: Parser<S, Cl>,
  p: Parser<S, A>
): Parser<S, A> {
  return (state) => {
    open(state)
    let a = p(state)
    close(state)
    return a
  }
}

export function many_till<S, A, E>(
  p: Parser<S, A>,
  end: Parser<S, E>
): Parser<S, A[]> {
  return (state) => {
    let arr: A[] = []

    while (true) {
      try {
        end(state)
        return arr
      } catch {
        let x = p(state)
        arr.push(x)
      }
    }
  }
}

export function left_common<S, A, B>(
  pa: Parser<S, A>,
  fs: ((a: A) => Parser<S, B>)[]
): Parser<S, B> {
  return (state) => {
    let a = pa(state)
    let ps = fs.map((f) => f(a))
    let p = choice(ps)
    return p(state)
  }
}

// S -> a | Sb
// abbbbbbbb
export function left_rec<S, A>(
  pa: Parser<S, A>,
  fs: ((a: A) => Parser<S, A>)[]
): Parser<S, A> {
  return (state) => {
    let a = pa(state)
    let ps = fs.map((f) => f(a))
    let p = choice(ps)
    let lr = left_rec(p, fs)
    return or(lr, pure(a))(state)
  }
}

/*
export function left_rec<S, A>(
  pa: Parser<S, A>,
  fs: ((a: A) => Parser<S, A>)[]
): Parser<S, A> {
  return (state) => {
    let a = pa(state)

    while (true) {
      let ps = fs.map((f) => f(a))
      let p = choice(ps)
      let ma = option(p)(state)
      if (ma.length === 0) {
        return a
      } else {
        a = ma[0]
      }
    }
  }
}
*/
