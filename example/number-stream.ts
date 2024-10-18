import { ArrayState, array_end, nothing, parse_array, satisfy, tokens } from "../src/index"

function p(state: ArrayState<number, null>): [number, number[]] {
  let x = satisfy((x: number) => x === 1)(state)
  let xs = tokens([2, 3, 4, 5])(state)
  array_end(nothing)(state)
  return [x, xs]
}

const ret = parse_array(p)([1, 2, 3, 4, 5], null)
console.log(ret)
