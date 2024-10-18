import { Lexer, StringParser, StringState, choice, many, parse, trim_code } from "../src/index"

type SExp = SExp[] | number | string

const lex = new Lexer()

const pnum: StringParser<SExp> = lex.float
const psymbol: StringParser<SExp> = lex.identifier
const plist: StringParser<SExp> = lex.parens(many(psexp))

function psexp(state: StringState): SExp {
  return choice([psymbol, pnum, plist])(state)
}

const code = "(define (fact n) (if (eq n 0) 1 (mul n (fact (sub n 1)))))"
const ret = parse(trim_code(psexp))(code)

console.log(ret)
