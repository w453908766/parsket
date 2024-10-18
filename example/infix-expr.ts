import { Lexer, Operators, StringParser, build_expr_parser, fmap, parse } from "../src/index"

type Expr = [string, Expr] | [Expr, string] | [string, Expr, Expr] | number

const lex = new Lexer()
const pnumber: StringParser<Expr> = lex.float

type Binary = StringParser<(x: Expr, y: Expr) => Expr>
type Unary = StringParser<(x: Expr) => Expr>

function infix(sym: string): Binary {
  return fmap((sym) => (x, y) => [sym, x, y], lex.symbol(sym))
}

function prefix(sym: string): Unary {
  return fmap((sym) => (x) => [sym, x], lex.symbol(sym))
}

function postfix(sym: string): Unary {
  return fmap((sym) => (x) => [x, sym], lex.symbol(sym))
}

let Ops1 = new Operators(true, [infix("+"), infix("-")])
let Ops2 = new Operators(true, [infix("*")])

let expr_parser = build_expr_parser([Ops2, Ops1], pnumber)

const code = "2+3*7-4+5*9"
const ret: Expr = parse(expr_parser)(code)
console.log(ret)