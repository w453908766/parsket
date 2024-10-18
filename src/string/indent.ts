import { StringParser, StringState, between, error, many1, seq1 } from "../index"

export function laidout<A>(p: StringParser<A>): StringParser<A> {
  return (state) => {
    let ind = state.indent
    let cur = state.pos.col
    state.indent = cur
    let res = p(state)
    state.indent = ind
    return res
  }
}

export function indented(state: StringState): null {
  if (state.pos.col > state.indent) {
    return null
  } else {
    throw error(`expecting indented to ${state.indent + 1}`)
  }
}

export function dedented(state: StringState): null {
  if (state.pos.col < state.indent) {
    return null
  } else {
    throw error(`expecting dedented to ${state.indent + 1}`)
  }
}

export function aligned(state: StringState): null {
  if (state.pos.col === state.indent) {
    return null
  } else {
    throw error(`expecting aligned to ${state.indent + 1}`)
  }
}

export function block<A>(p: StringParser<A>): StringParser<A[]> {
  return laidout(many1(seq1(aligned, p)))
}

export function block_newline<A, B>(
  p: StringParser<A>,
  newlines: StringParser<B>
): StringParser<A[]> {
  return laidout(many1(between(aligned, newlines, p)))
}
