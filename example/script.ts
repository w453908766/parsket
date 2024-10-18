import { Lexer, StringParser, StringState, choice, many, or } from "../src/index"

/*
Program     := Expr*

Bool        := 'True|False'
Int         := '[0-9]+'
Ident := '[a-z][a-zA-Z0-9]*'

Term := variable=Ident | bool=Bool | number=Int

Expr := cond=Cond | lambda=Lambda | call=Call | term=Term

Cond := 'if' cond=Expr 'then' true_=Expr 'else' false_=Expr
Lambda := 'lambda' param=Ident '{' body=Expr '}'
Call := 'call' func=Expr  '\(' arg=Expr '\)'
*/

const lex = new Lexer([
  "True",
  "False",
  "if",
  "then",
  "else",
  "lambda",
  "call",
])

type Expr = boolean | number | string | Cond | Lambda | Call
class Cond {
  constructor(public cond: Expr, public true_: Expr, public false_: Expr) {}
}
class Lambda {
  constructor(public name: string, public body: Expr) {}
}
class Call {
  constructor(public func: Expr, public arg: Expr) {}
}

const bool: StringParser<Expr> = or(
  lex.symbol("True"),
  lex.symbol("False")
)
const int: StringParser<Expr> = lex.natural
const ident: StringParser<Expr> = lex.identifier

const term: StringParser<Expr> = choice([bool, int, ident])

function cond(state: StringState): Cond {
  lex.symbol("if")(state)
  let cond = expr(state)
  lex.symbol("then")(state)
  let true_ = expr(state)
  lex.symbol("else")(state)
  let false_ = expr(state)
  return new Cond(cond, true_, false_)
}

function lambda(state: StringState): Lambda {
  lex.symbol("lambda")(state)
  let name = lex.identifier(state)
  let body = lex.brackets("{", "}", expr)(state)
  return new Lambda(name, body)
}

function call(state: StringState): Call {
  lex.symbol("call")(state)
  let func = expr(state)
  let arg = lex.brackets("(", ")", expr)(state)
  return new Call(func, arg)
}

const expr: StringParser<Expr> = choice([cond, lambda, call, term])
const program = many(expr)
