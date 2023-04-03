import readLines from "../helpers/readLines"

type Point = [number, number] // y, x

const world = readLines(__dirname + "/input.txt").map((line) =>
  line.split("").map((x) => parseInt(x, 10)),
)

function getAdjacent([y, x]: Point) {
  return [
    [y - 1, x] as Point,
    [y + 1, x] as Point,
    [y, x - 1] as Point,
    [y, x + 1] as Point,
  ].filter(
    ([y, x]) => y >= 0 && x >= 0 && y < world.length && x < world[0].length,
  )
}

const lowPoints: Point[] = []

for (let y = 0; y < world.length; y++) {
  for (let x = 0; x < world[0].length; x++) {
    const height = world[y][x]
    const isLowPoint = getAdjacent([y, x]).every(
      ([y, x]) => world[y][x] > height,
    )
    if (isLowPoint) lowPoints.push([y, x])
  }
}

console.log(
  "Star 1:",
  lowPoints.map(([y, x]) => world[y][x] + 1).reduce((a, b) => a + b),
)

const basinSizes: Record<string, number> = {} // From low point to basin size

for (let y = 0; y < world.length; y++) {
  for (let x = 0; x < world[0].length; x++) {
    const height = world[y][x]
    if (height >= 9) continue

    let lowestPoint: Point = [y, x]

    while (true) {
      const lowerAdjacent = getAdjacent(lowestPoint).find(
        ([ay, ax]) => world[ay][ax] < world[lowestPoint[0]][lowestPoint[1]],
      )
      if (!lowerAdjacent) break
      lowestPoint = lowerAdjacent
    }

    basinSizes[lowestPoint.join(",")] =
      (basinSizes[lowestPoint.join(",")] ?? 0) + 1
  }
}

console.log(
  "Star 2:",
  Object.values(basinSizes)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b, 1),
)
