import { error } from "../index"
import { ParsingError, empty_error } from "../error"

export class ArrayState<T, V> {
  pos: number = 0
  error: ParsingError = empty_error

  constructor(public array: T[], public value: V) {}

  get length(): number {
    return this.array.length - this.pos
  }

  get unique(): number {
    return this.length
  }

  consume(): T {
    if (this.array.length === this.pos) {
      throw error("input run out")
    } else {
      let x = this.array[this.pos]
      this.pos++
      this.error = empty_error
      return x
    }
  }

  head(): T {
    if (this.array.length === this.pos) {
      throw error("input run out")
    } else {
      return this.array[this.pos]
    }
  }
}

export type ArrayParser<T, V, A> = (state: ArrayState<T, V>) => A
