import { ParsingError, attempt, between, error, eval_error, merge_error, spaces } from "../index"
import { StringParser, StringState } from "./string-parser"

export function trim_code<A>(p: StringParser<A>): StringParser<A> {
  return string_end(between(spaces, spaces, p))
}

export function string_end<A>(p: StringParser<A>): StringParser<A> {
  return (state) => {
    let r = p(state)
    if (state.length === 0) {
      return r
    } else {
      throw error("expecting end of input")
    }
  }
}

export function format_error(
  state: StringState,
  msgs: ParsingError
): string {
  const line = state.pos.line + 1
  const col = state.pos.col + 1
  const code = state.code
  const chr = code.length === 0 ? "eof" : code[0]

  const mess = eval_error(merge_error(state.error, msgs)).join("\n")

  const message =
    `parse error at (line ${line}, column ${col}):\n` +
    `extend attribute is ${state.value}\n` +
    `unexpected "${chr}"\n` +
    `${mess} \n`

  return message
}

export function parse<A>(p: StringParser<A>): (code: string) => A {
  return (code) => {
    const state = new StringState(code)
    try {
      return p(state)
    } catch (messages) {
      if (messages instanceof ParsingError) {
        throw format_error(state, messages)
      } else {
        throw messages
      }
    }
  }
}

export function string_backup(state: StringState): StringState {
  const backup = new StringState(state.code)
  backup.pos = state.pos
  backup.indent = state.indent
  backup.value = state.value
  return backup
}

export function string_restore(
  state: StringState,
  backup: StringState
) {
  state.pos = backup.pos
  state.code = backup.code
  state.indent = backup.indent
  state.value = backup.value
}

export function string_attempt<A>(
  p: StringParser<A>
): StringParser<A> {
  return attempt(string_restore, string_backup, p)
}
