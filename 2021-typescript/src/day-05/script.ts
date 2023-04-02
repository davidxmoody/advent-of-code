import readLines from "../helpers/readLines"

type World = number[][]
type Point = {x: number; y: number}
type Line = {from: Point; to: Point}

const lines: Line[] = readLines(__dirname + "/input.txt").map((textLine) => {
  const match = textLine.match(/^(\d+),(\d+) -> (\d+),(\d+)/)
  if (!match) throw new Error("Failed to parse")
  return {
    from: {x: parseInt(match[1], 10), y: parseInt(match[2], 10)},
    to: {x: parseInt(match[3], 10), y: parseInt(match[4], 10)},
  }
})

function fillPoint(world: World, {x, y}: Point) {
  world[y] = world[y] ?? []
  world[y][x] = (world[y][x] ?? 0) + 1
}

function fillLine(world: World, {from, to}: Line, includeDiagonals: boolean) {
  const isDiagonal = !(from.x === to.x || from.y === to.y)
  if (isDiagonal && !includeDiagonals) return

  let current = from
  fillPoint(world, current)

  while (current.x !== to.x || current.y !== to.y) {
    current = {
      x: current.x + Math.sign(to.x - from.x),
      y: current.y + Math.sign(to.y - from.y),
    }
    fillPoint(world, current)
  }
}

function countOverlaps(includeDiagonals: boolean) {
  const world: World = []
  lines.forEach((line) => fillLine(world, line, includeDiagonals))
  return world.flat().filter((count) => count >= 2).length
}

console.log("Star 1:", countOverlaps(false))

console.log("Star 2:", countOverlaps(true))
