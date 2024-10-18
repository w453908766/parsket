import { StringParser, chr, left_rec, parse } from "../src/index"

type Exp = string | [Exp, number] | [Exp, string]

function exp0(e: Exp): StringParser<Exp> {
  return (state) => {
    chr("0")(state)
    return [e, 0]
  }
}

function expx(e: Exp): StringParser<Exp> {
  return (state) => {
    chr("x")(state)
    return [e, "x"]
  }
}

const exp: StringParser<Exp> = left_rec(chr("a"), [exp0, expx])

// E -> a | E0 | Ex

const code = "a0x0"
const ret: Exp = parse(exp)(code)

console.log(ret)
