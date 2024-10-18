import { Pos, init_pos, push_pos } from "../index"
import { ParsingError, empty_error } from "../error"

export class StringState {
  pos: Pos = init_pos
  indent: number = 0
  value: any = null
  error: ParsingError = empty_error

  constructor(public code: string) {}

  consume(n: number): string {
    let code = this.code
    let head = code.substr(0, n)
    this.pos = push_pos(this.pos, code, n)
    this.code = code.slice(n)
    if (n !== 0) this.error = empty_error
    return head
  }

  get length(): number {
    return this.code.length
  }

  get unique(): number {
    return this.length
  }
}

export type StringParser<A> = (state: StringState) => A
