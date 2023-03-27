import readLines from "../helpers/readLines"

const directions = ["N", "S", "W", "E"] as const

type Direction = typeof directions[number]
type Position = [number, number]
type World = Record<string, Record<string, boolean>>

const world: World = {}

readLines(__dirname + "/input.txt").forEach((line, y) => {
  line.split("").forEach((value, x) => {
    if (!world[y]) world[y] = {}
    world[y][x] = value === "#"
  })
})

function step(position: Position, directions: Direction[]): Position {
  if (directions.length === 0) return position

  const [y, x] = position
  const [head, ...tail] = directions

  switch (head) {
    case "N":
      return step([y - 1, x], tail)
    case "S":
      return step([y + 1, x], tail)
    case "W":
      return step([y, x - 1], tail)
    case "E":
      return step([y, x + 1], tail)
  }
}

function moveElf([fromY, fromX]: Position, [toY, toX]: Position) {
  world[fromY][fromX] = false
  if (!world[toY]) world[toY] = {}
  world[toY][toX] = true
}

function hasElf([y, x]: Position) {
  return !!world[y]?.[x]
}

function areDirectionsEmpty(elf: Position, directions: Direction[][]) {
  return directions.every((d) => !hasElf(step(elf, d)))
}

function isIsolated(elf: Position) {
  return areDirectionsEmpty(elf, [
    ["N"],
    ["S"],
    ["W"],
    ["E"],
    ["N", "W"],
    ["N", "E"],
    ["S", "W"],
    ["S", "E"],
  ])
}

function isDirectionValid(elf: Position, direction: Direction) {
  const directionsThatMustBeEmpty = (
    {
      N: [["N"], ["N", "W"], ["N", "E"]],
      S: [["S"], ["S", "W"], ["S", "E"]],
      E: [["E"], ["N", "E"], ["S", "E"]],
      W: [["W"], ["N", "W"], ["S", "W"]],
    } as Record<Direction, Direction[][]>
  )[direction]

  return areDirectionsEmpty(elf, directionsThatMustBeEmpty)
}

function getElfPositions(): Position[] {
  const elfPositions: Position[] = []

  Object.keys(world).forEach((y) => {
    Object.keys(world[y]).forEach((x) => {
      const position: Position = [parseInt(y, 10), parseInt(x, 10)]
      if (hasElf(position)) {
        elfPositions.push(position)
      }
    })
  })

  return elfPositions
}

let iterations = 0

function simulate() {
  // Mapping from stringified destination to movements
  const proposedMovements: Record<
    string,
    Array<{from: Position; to: Position}>
  > = {}

  const directionsToConsider = [
    ...directions.slice(iterations % directions.length),
    ...directions.slice(0, iterations % directions.length),
  ]

  for (const elf of getElfPositions()) {
    if (isIsolated(elf)) continue

    const validDirection = directionsToConsider.find((d) =>
      isDirectionValid(elf, d),
    )

    if (validDirection) {
      const destination = step(elf, [validDirection])
      const stringKey = destination.join(",")
      if (!proposedMovements[stringKey]) proposedMovements[stringKey] = []
      proposedMovements[stringKey].push({from: elf, to: destination})
    }
  }

  const nonOverlappingProposedMovements = Object.values(
    proposedMovements,
  ).flatMap((movements) => (movements.length === 1 ? movements : []))

  for (const {from, to} of nonOverlappingProposedMovements) {
    moveElf(from, to)
  }

  iterations++

  return nonOverlappingProposedMovements.length > 0
}

function getBounds() {
  let minY = Infinity
  let maxY = -Infinity
  let minX = Infinity
  let maxX = -Infinity

  Object.keys(world).forEach((strY) => {
    Object.keys(world[strY]).forEach((strX) => {
      const y = parseInt(strY)
      const x = parseInt(strX)
      if (y > maxY) maxY = y
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (x < minX) minX = x
    })
  })

  return {minY, maxY, minX, maxX}
}

function countEmptySquares() {
  const bounds = getBounds()
  let emptyCount = 0

  for (let y = bounds.minY; y <= bounds.maxY; y++) {
    for (let x = bounds.minX; x <= bounds.maxX; x++) {
      if (!hasElf([y, x])) emptyCount++
    }
  }
  return emptyCount
}

// function printWorld() {
//   const bounds = getBounds()
//   let worldString = ""
//   for (let y = bounds.minY; y <= bounds.maxY; y++) {
//     for (let x = bounds.minX; x <= bounds.maxX; x++) {
//       worldString += hasElf([y, x]) ? "#" : "."
//     }
//     worldString += "\n"
//   }
//   console.log(worldString)
//   console.log(getBounds())
// }

while (iterations < 10) simulate()

console.log("Star 1:", countEmptySquares())

while (simulate()) {}

console.log("Star 2:", iterations)
