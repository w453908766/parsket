import { Lexer, StringState, block, indented, many, many1, or, parse, seq1 } from "../src/index"

const lex = new Lexer(["block"])

type Exp = [string, number[]] | Exp[]

function oneline(state: StringState): Exp {
  let head = lex.identifier(state)
  let tail = many(seq1(indented, lex.float))(state)
  return [head, tail]
}

function pblock(state: StringState): Exp {
  lex.symbol("block")(state)
  indented(state)
  return block(pexp)(state)
}

const pexp = or(pblock, oneline)

const pexps = many1(pexp)

let code = `block
  aa
  bb
      1111
    2222
  block 
    xx 3333
dd
  4444`

const ret = parse(pexps)(code)

console.log(ret)
