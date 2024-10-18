import { StringParser, StringState, error } from "../index"

export function any_char(state: StringState): string {
  if (state.length === 0) throw error("unexpected empty input")
  else {
    return state.consume(1)
  }
}

export const chr = str

export function str(s: string): StringParser<string> {
  return (state) => {
    let code = state.code
    if (code === "") throw error("unexpected empty input")
    else if (code.startsWith(s)) {
      state.consume(s.length)
      return s
    } else throw error(`expecting string "${s}"`)
  }
}

export function string_till(s: string): StringParser<string> {
  return (state) => {
    const code = state.code
    for (let i = 0; i < code.length; i++) {
      if (s.indexOf(code[i]) !== -1) return state.consume(i)
    }

    throw error(`have not find char in "${s}"`)
  }
}

export function reg_exp(msg: string, re: RegExp): StringParser<string> {
  if (re.source[0] !== "^") {
    throw (
      "re must match from the beginning (start with `^`)\n" +
      `re: ${re.toString()}`
    )
  }
  return (state) => {
    let r = state.code.match(re)
    if (r == null) {
      throw error(msg)
    } else {
      return state.consume(r[0].length)
    }
  }
}

export const space: StringParser<string> = reg_exp(
  "expecting space",
  /^\s/
)

export const spaces: StringParser<string> = reg_exp(
  "expecting spaces",
  /^\s*/
)

export const lower: StringParser<string> = reg_exp(
  "expecting lowercase letter",
  /^[a-z]/
)

export const upper: StringParser<string> = reg_exp(
  "expecting uppercase letter",
  /^[A-Z]/
)

export const digit: StringParser<string> = reg_exp(
  "expecting digit",
  /^\d/
)

export const letter: StringParser<string> = reg_exp(
  "expecting letter",
  /^[a-zA-Z]/
)

export const alpha_num: StringParser<string> = reg_exp(
  "expecting letter or digit",
  /^\w/
)

export const unicode_letter: StringParser<string> = reg_exp(
  "expecting unicode letter",
  /^[\p{Letter}]/u
)
