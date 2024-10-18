import { Lexer, Pos, StringParser, StringState, block_newline, chr, error, indented, label, left_common, many, nothing, option, option_default, or, parse, pure, reg_exp, seq, trim_code,  } from "../src/index"

//const spaces = reg_exp("expecting spaces", /^ */)
const white = reg_exp("expecting spaces", /^ *(\/\/[^\n]*)?/)
const newlines = label(
  "expecting newlines",
  many(seq(chr("\n"), white))
)
const lex = new Lexer([], nothing, white)

class Tag {
  constructor(public value: string, public pos: Pos) {}
}

type Block = Tag | [Tag, Block[]]

const tag = or(string_lit, unpack_str)

function unpack_str(state: StringState): Tag {
  if (state.code.length === 0) throw error("input run out")
  let pos = state.pos
  let re = /^[^:^\n^(\/\/)]*/
  let cs = lex.lex(reg_exp("expecting unpack_str", re))(state)
  return new Tag(cs.trimEnd(), pos)
}

function string_lit(state: StringState): Tag {
  let pos = state.pos
  let cs = lex.string_lit(state)
  return new Tag(cs, pos)
}

function block_elems(state: StringState): Block[] {
  indented(state)
  return block_newline(data_block, newlines)(state)
}

function tag_block(t: Tag): StringParser<Block> {
  return (state) => {
    lex.symbol(":")(state)
    let v0 = option(data_block)(state)
    newlines(state)
    let vs = option_default([], block_elems)(state)

    let vss = v0.concat(vs)
    if (vss.length === 0) throw error("expecting content")
    return [t, vss]
  }
}

const data_block = left_common(tag, [tag_block, pure])

function program(state: StringState): Block[] {
  let blocks = block_newline(data_block, newlines)
  return trim_code(blocks)(state)
}

const code = `
   
aa: bb: cc: "dd:xxx"
            ee
      ff: gg // efsfs
        
  // fdsfdsfs
  hh

aaa:bbb
`

const ret = parse(program)(code)
console.log(ret)
