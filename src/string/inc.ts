import { } from "../index"

/*
export function new_inc(code: string): Inc {
  let inc = new Inc()
  inc.children = [code]
  inc.length = code.length
  return inc
}

export class Inc {
  length: number
  children: (string | Inc)[]
  parse: (code: string) => void
  constructor() {
    this.length = 0
    this.children = []
    this.parse = (code) => {}
  }

  toString(): string {
    let ss = this.children.map((x) => x.toString())
    return ss.join("")
  }
}

export type IncParser = StringParser<Inc>

export type Callback<A> = (a: A) => void

function code_handover(inc0: Inc, inc1: Inc, state: StringState) {
  let code = inc0.children.pop() as string
  let len = state.code.length
  if (code.length !== len) {
    inc0.children.push(code.substr(0, code.length - len))
  }
  if (len > 0) inc1.children.push(state.code)
}

function inc_build<A>(
  inc: Inc,
  p: StringParser<A>,
  state: StringState
): A {
  let pp = state.value

  state.value = inc
  code_handover(pp, inc, state)

  pp.children.push(inc)

  let start = state.code.length
  let ret = p(state)
  let end = state.code.length
  inc.length = start - end

  code_handover(inc, pp, state)
  state.value = pp

  return ret
}

function new_parse<A>(
  inc: Inc,
  callback: Callback<A>,
  p: StringParser<A>
): (code: string) => void {
  // TODO: param should use string or State? new State or old State?
  return (code) => {
    let state = new StringState(code)
    state.value = inc
    inc.children = [code]
    let ret = p(state)
    callback(ret)
  }
}

export function inc_map<A>(
  callback: Callback<A>,
  p: StringParser<A>
): IncParser {
  return (state) => {
    let inc = new Inc()
    let ret = inc_build(inc, p, state)
    callback(ret)
    inc.parse = new_parse(inc, callback, p)
    return inc
  }
}

type IncPos = [Inc, number, number]

export function focusing([inc, start, end]: IncPos): IncPos | null {
  for (let child of inc.children) {
    let len = child.length
    if (start <= 0) return null
    else if (end < len) {
      if (child instanceof Inc) {
        return [child, start, end]
      } else {
        return null
      }
    } else {
      start -= len
      end -= len
    }
  }
  return null
}

function reparse([inc, start, end]: IncPos, insert_code: string) {
  let old_code = inc.toString()
  let new_code = [
    old_code.substring(0, start),
    insert_code,
    old_code.substring(end),
  ].join("")

  inc.parse(new_code)
}

export function modify_code(inc_pos: IncPos, insert_code: string): Inc {
  let diff = insert_code.length - (inc_pos[2] - inc_pos[1])
  while (true) {
    let inc = inc_pos[0]
    inc.length += diff

    let inc_pos1 = focusing(inc_pos)
    if (inc_pos1 === null) {
      reparse(inc_pos, insert_code)
      return inc
    } else {
      inc_pos = inc_pos1
    }
  }
}

*/
