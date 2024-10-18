import { StringParser, StringState, between, choice, chr, error, fmap, label, many, nothing, reg_exp, spaces, str, string_till } from "../index"

const natural_re = /^\d+/
const integer_re = /^(\+|\-)?\d+/
const float_re = /^(\+|\-)?\d+(\.\d+)?((e|E)\d+)?/
const ident_re = /^[_\p{Letter}][_\p{Letter}0-9]*/u

export class Lexer {
  keywords: Set<string>
  constructor(
    key_array: string[] = [],
    public front: StringParser<any> = nothing,
    public back: StringParser<any> = spaces
  ) {
    this.keywords = new Set(key_array)
  }

  lex<A>(p: StringParser<A>): StringParser<A> {
    return (state) => {
      this.front(state)
      let x = p(state)
      this.back(state)
      return x
    }
  }

  symbol(s: string): StringParser<string> {
    return this.lex(str(s))
  }

  brackets<A>(
    left: string,
    right: string,
    p: StringParser<A>
  ): StringParser<A> {
    return between(this.symbol(left), this.symbol(right), p)
  }

  parens<A>(p: StringParser<A>): StringParser<A> {
    return this.brackets("(", ")", p)
  }

  natural: StringParser<number> = this.lex(
    fmap(Number, reg_exp("expecting number", natural_re))
  )

  integer: StringParser<number> = this.lex(
    fmap(Number, reg_exp("expecting integer", integer_re))
  )

  float: StringParser<number> = this.lex(
    fmap(Number, reg_exp("expecting float", float_re))
  )

  identifier: StringParser<string> = this.lex((state) => {
    let r = state.code.match(ident_re)
    if (r == null) {
      throw error("expecting identifier")
    } else if (this.keywords.has(r[0])) {
      throw error(`unexpected keyword "${r[0]}"`)
    } else {
      return state.consume(r[0].length)
    }
  })

  // TODO: handle escape char
  string_lit: StringParser<string> = this.lex(
    label("expecting string_lit", (state: StringState) => {
      chr('"')(state)
      let s = string_till('"')(state)
      chr('"')(state)
      return s
    })
  )

  lexer<T>(ps: StringParser<T>[]): StringParser<T[]> {
    return many(choice(ps))
  }
}
