export type Point = {x: number; y: number}

export class World<T> {
  private data: T[][] // y, x

  constructor(initialData: T[][] = []) {
    this.data = initialData ?? []
  }

  static fill<T>(
    {width, height}: {width: number; height: number},
    defaultValue: T,
  ) {
    const data: T[][] = [...Array(height)].map(() =>
      Array(width).fill(defaultValue),
    )
    return new World(data)
  }

  get({x, y}: Point) {
    return this.data[y][x]
  }

  set({x, y}: Point, value: T) {
    this.data[y][x] = value
  }

  forEachCell(fn: ({x, y}: Point, value: T) => void) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        fn({x, y}, this.data[y][x])
      }
    }
  }

  getAdjacent({x, y}: Point, {includeDiagonal} = {includeDiagonal: false}) {
    const orthogonal: Point[] = [
      {x, y: y - 1},
      {x, y: y + 1},
      {x: x - 1, y},
      {x: x + 1, y},
    ]

    const diagonal: Point[] = [
      {x: x - 1, y: y - 1},
      {x: x + 1, y: y - 1},
      {x: x - 1, y: y + 1},
      {x: x + 1, y: y + 1},
    ]

    return [...orthogonal, ...(includeDiagonal ? diagonal : [])].filter(
      ({x, y}) => y >= 0 && x >= 0 && y < this.height && x < this.width,
    )
  }

  get height() {
    return this.data.length
  }

  get width() {
    return this.data[0].length
  }

  print(toString: (value: T) => string = (x) => x?.toString() ?? " ") {
    console.log(this.data.map((row) => row.map(toString).join("")).join("\n"))
  }
}
