import { Parser, choice, left_rec, many, pure, seq } from "./index"

type Binary<S, A> = Parser<S, (x: A, y: A) => A>
type Unary<S, A> = Parser<S, (x: A) => A>

export class Operators<S, A> {
  constructor(
    public left_assoc: boolean = true,
    public infix: Binary<S, A>[] = [],
    public prefix: Unary<S, A>[] = [],
    public postfix: Unary<S, A>[] = []
  ) {}
}

function termP<S, A>(
  prefix: Unary<S, A>[],
  postfix: Unary<S, A>[],
  term: Parser<S, A>
): Parser<S, A> {
  return (state) => {
    let pure_id = pure((x: A) => x)
    let prefix1 = prefix.concat([pure_id])
    let postfix1 = postfix.concat([pure_id])
    let pre = choice(prefix1)(state)
    let x = term(state)
    let post = choice(postfix1)(state)
    return post(pre(x))
  }
}

function lassoc_p<S, A>(
  infixOp: Binary<S, A>,
  term: Parser<S, A>
): (x: A) => Parser<S, A> {
  return (x) => {
    return (state) => {
      let f = infixOp(state)
      let y = term(state)
      return f(x, y)
    }
  }
}

function rassoc_p<S, A>(
  infixOp: Binary<S, A>,
  term: Parser<S, A>
): Parser<S, A> {
  return (state) => {
    let x = term(state)
    let fs = many(seq(infixOp, term))(state)
    if (fs.length === 0) {
      return x
    } else {
      let z = fs[fs.length - 1][1]
      for (let i = fs.length - 1; i > 0; i--) {
        let f = fs[i][0]
        let y = fs[i - 1][1]
        z = f(y, z)
      }
      return fs[0][0](x, z)
    }
  }
}

export function build_expr<S, A>(
  ops: Operators<S, A>,
  expr: Parser<S, A>
): Parser<S, A> {
  let term = termP(ops.prefix, ops.postfix, expr)

  let infixOp = choice(ops.infix)

  if (ops.left_assoc) {
    let left_expr = lassoc_p(infixOp, term)
    return left_rec(term, [left_expr])
  } else {
    return rassoc_p(infixOp, term)
  }
}

export function build_expr_parser<S, A>(
  op_table: Operators<S, A>[],
  expr: Parser<S, A>
): Parser<S, A> {
  for (let ops of op_table) {
    expr = build_expr(ops, expr)
  }
  return expr
}
