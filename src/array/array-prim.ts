import { ArrayParser, ArrayState, ParsingError, attempt, error, eval_error, merge_error } from "../index"

export function format_array_error<S, V>(
  state: ArrayState<S, V>,
  msgs: ParsingError
): string {
  const array = state.array
  const pos = state.pos
  const x = state.length === 0 ? "eof" : array[pos]
  const mess = eval_error(merge_error(state.error, msgs)).join("\n")

  const message =
    `parse error at (pos ${pos}):\n` +
    `extend attribute is ${state.value}\n` +
    `unexpected "${x}"\n` +
    `${mess} \n`

  return message
}

export function parse_array<T, V, A>(
  p: ArrayParser<T, V, A>
): (array: T[], value: V) => A {
  return (array, value) => {
    const state = new ArrayState<T, V>(array, value)
    try {
      return p(state)
    } catch (messages) {
      if (messages instanceof ParsingError) {
        throw format_array_error(state, messages)
      } else {
        throw messages
      }
    }
  }
}

export function array_backup<T, V>(
  state: ArrayState<T, V>
): ArrayState<T, V> {
  const backup = new ArrayState(state.array, state.value)
  backup.pos = state.pos
  return backup
}

export function array_restore<T, V>(
  state: ArrayState<T, V>,
  backup: ArrayState<T, V>
) {
  state.pos = backup.pos
  state.array = backup.array
  state.value = backup.value
}

export function array_attempt<T, V, A>(
  p: ArrayParser<T, V, A>
): ArrayParser<T, V, A> {
  return attempt(array_restore, array_backup, p)
}

export function array_end<T, V, A>(
  p: ArrayParser<T, V, A>
): ArrayParser<T, V, A> {
  return (state) => {
    let ret = p(state)
    if (state.length === 0) {
      return ret
    } else {
      throw error("expecting array end")
    }
  }
}
