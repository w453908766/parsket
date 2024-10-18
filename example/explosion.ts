import { Lexer, StringParser, StringState, choice, left_common, or, parse, pure, seq1, str, string_attempt } from "../src/index"

const lex = new Lexer()

function parens0(state: StringState): number {
  let r = lex.brackets("(", "!)", pexp)(state)
  return r + 1
}

function parens1(state: StringState): number {
  let r = lex.brackets("(", ")", pexp)(state)
  return r + 1
}

const pexp: StringParser<number> = choice([
  string_attempt(parens0),
  parens1,
  pure(0),
])

// E -> (E!) | (E) | empty
// T(n) = O(2^n)

const code = "(((((((((())))))))))"
const ret = parse(pexp)(code)
console.log(ret)

// slove

function parens0_(left: number): StringParser<number> {
  return (state) => {
    str("!)")(state)
    return left + 1
  }
}

function parens1_(left: number): StringParser<number> {
  return (state) => {
    str(")")(state)
    return left + 1
  }
}

function pexp_(state: StringState): number {
  let pleft = seq1(str("("), pexp_)
  let exp = left_common(pleft, [parens0_, parens1_])

  return or(exp, pure(0))(state)
}

// E -> (E!) | (E) | empty
// T(n) = O(2^n)

const ret_ = parse(pexp_)(code)
console.log(ret_)

//////////////
