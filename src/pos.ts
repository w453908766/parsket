
export class Pos {
  constructor(public line: number, public col: number) {}
}

export const init_pos = new Pos(0, 0)

export function push_pos(pos: Pos, code: string, num: number): Pos {
  let line = pos.line
  let col = pos.col

  for (let i = 0; i < num; i++) {
    if (code[i] == "\n") {
      line++
      col = 0
    } else {
      col++
    }
  }

  return new Pos(line, col)
}
