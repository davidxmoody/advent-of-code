import {equals} from "ramda"
import readLines from "../helpers/readLines"

type Point = [number, number] // x, y
type Terrain = "R" | "S" | undefined
type World = Terrain[][] // y, x

function cloneWorld(world: World): World {
  return world.map((row) => row.map((x) => x))
}

function isFilled(world: World, [x, y]: Point) {
  return !!world[y]?.[x]
}

function fill(world: World, [x, y]: Point, terrain: Terrain) {
  world[y] = world[y] || []
  world[y][x] = terrain
}

function stepTowards(cursor: Point, destination: Point): Point {
  return [
    cursor[0] + Math.sign(destination[0] - cursor[0]),
    cursor[1] + Math.sign(destination[1] - cursor[1]),
  ]
}

function getBounds(world: World) {
  const bounds = {
    minY: Infinity,
    maxY: -Infinity,
    minX: Infinity,
    maxX: -Infinity,
  }

  world.forEach((row, y) => {
    if (y < bounds.minY) bounds.minY = y
    if (y > bounds.maxY) bounds.maxY = y
    row.forEach((_col, x) => {
      if (x < bounds.minX) bounds.minX = x
      if (x > bounds.maxX) bounds.maxX = x
    })
  })

  return bounds
}

// function printWorld(world: World) {
//   const bounds = getBounds(world)
//   let output = ""
//   for (let y = bounds.minY; y <= bounds.maxY; y++) {
//     for (let x = bounds.minX; x <= bounds.maxX; x++) {
//       output += world[y]?.[x] ?? " "
//     }
//     output += "\n"
//   }
//   console.log(output)
// }

const rocks: World = []

readLines(__dirname + "/input.txt").map((line) => {
  const points = line
    .split(" -> ")
    .map((point) => point.split(",").map((num) => parseInt(num, 10)) as Point)

  let cursor = points[0]
  fill(rocks, cursor, "R")

  for (const point of points.slice(1)) {
    while (!equals(cursor, point)) {
      cursor = stepTowards(cursor, point)
      fill(rocks, cursor, "R")
    }
  }
})

const rockBounds = getBounds(rocks)

const sandStartingPoint: Point = [500, 0]

function simulateSandGrain(world: World, floor: boolean) {
  if (isFilled(world, sandStartingPoint)) {
    return false
  }

  let sandPosition = sandStartingPoint

  function isFloorLevel(point: Point) {
    return floor && point[1] === rockBounds.maxY + 2
  }

  function insideSimulationBounds() {
    if (floor) return true
    return sandPosition[1] <= rockBounds.maxY
  }

  while (insideSimulationBounds()) {
    const potentialNextPositions: Point[] = [
      [sandPosition[0], sandPosition[1] + 1],
      [sandPosition[0] - 1, sandPosition[1] + 1],
      [sandPosition[0] + 1, sandPosition[1] + 1],
    ]

    const nextFreePosition = potentialNextPositions.find(
      (p) => !isFilled(world, p) && !isFloorLevel(p),
    )

    if (!nextFreePosition) {
      fill(world, sandPosition, "S")
      return true
    }

    sandPosition = nextFreePosition
  }

  return false
}

function simulateMany(floor: boolean) {
  let sandCount = 0
  const world = cloneWorld(rocks)
  while (simulateSandGrain(world, floor)) {
    sandCount++
  }
  // printWorld(world)
  return sandCount
}

console.log("Star 1:", simulateMany(false))

console.log("Star 2:", simulateMany(true))
