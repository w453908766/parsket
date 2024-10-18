import { Lexer, ParsingError, StringParser, StringState, choice, fconst, format_error, parse, sep_by, seq0, string_till } from "../src/index"

type Value = object | Value[] | boolean | null | string | number

const lex = new Lexer(["true", "false", "null"])

const ptrue: StringParser<Value> = fconst(lex.symbol("true"), true)
const pfalse = fconst(lex.symbol("false"), false)
const pnull = fconst(lex.symbol("null"), null)
const pnumber = lex.float
const pstring = lex.string_lit

let fatal: string[] = []

function recovery<A>(
  p: StringParser<A>,
  q: StringParser<A>
): StringParser<A> {
  return (state) => {
    try {
      return p(state)
    } catch (es) {
      if (es instanceof ParsingError) {
        fatal.push(format_error(state, es))
        return q(state)
      } else {
        throw es
      }
    }
  }
}

function brackets_with_recovery<A>(
  left: string,
  right: string,
  defl: A,
  p: StringParser<A>
): StringParser<A> {
  return (state) => {
    lex.symbol(left)(state)
    let pxs = seq0(p, lex.symbol(right))
    let recov = seq0(
      fconst(string_till(right), defl),
      lex.symbol(right)
    )
    let xs = recovery(pxs, recov)(state)
    return xs
  }
}

function plist(state: StringState): Value[] {
  let pxs = sep_by(pvalue, lex.symbol(","))
  return brackets_with_recovery("[", "]", [], pxs)(state)
}

function ppair(state: StringState): [string, Value] {
  let key = lex.string_lit(state)
  lex.symbol(":")(state)
  let val = pvalue(state)
  return [key, val]
}

function pobj(state: StringState): object {
  let pxs = sep_by(ppair, lex.symbol(","))
  let xs = brackets_with_recovery("{", "}", [], pxs)(state)
  let obj: { [index: string]: Value } = {}
  for (let x of xs) {
    obj[x[0]] = x[1]
  }
  return obj
}

const pvalue: StringParser<Value> = choice([
  ptrue,
  pfalse,
  pnull,
  pnumber,
  pstring,
  plist,
  pobj,
])

const code =
  '{"name":"wjx", "age":26, "language":["c++", "haskell", "python"], "married": false}'
const ret: Value = parse(pvalue)(code)
console.log(ret)
console.log(fatal.join("\n"))
