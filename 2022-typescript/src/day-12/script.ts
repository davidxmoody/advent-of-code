import {equals, uniq} from "ramda"
import readLines from "../helpers/readLines"

type Pos = [number, number]

const cardinalDirections = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

let start: Pos = [-1, -1]
let end: Pos = [-1, -1]

const heights = readLines(__dirname + "/input.txt").map((line, lineIndex) =>
  line.split("").map((char, charIndex) => {
    if (char === "S") {
      start = [lineIndex, charIndex]
      return 1
    }

    if (char === "E") {
      end = [lineIndex, charIndex]
      return 26
    }

    return char.charCodeAt(0) - "a".charCodeAt(0) + 1
  }),
)

function canBeReachedFrom(target: Pos): Pos[] {
  return cardinalDirections
    .map(([dy, dx]) => [target[0] + dy, target[1] + dx] as Pos)
    .filter(([y, x]) => heights[y]?.[x] + 1 >= heights[target[0]][target[1]])
}

function exploreBackwards(stopWhen: (location: Pos) => boolean) {
  let currentDistance = 0
  let locations = [end]
  const shortestDistances = heights.map((row, y) =>
    row.map((_h, x) => (y === end[0] && x === end[1] ? 0 : Infinity)),
  )

  while (locations.length > 0) {
    if (locations.some(stopWhen)) {
      return currentDistance
    }

    locations = uniq(locations.flatMap(canBeReachedFrom)).filter(
      ([y, x]) => !(shortestDistances[y][x] < currentDistance),
    )

    currentDistance++

    for (const [y, x] of locations) {
      shortestDistances[y][x] = currentDistance
    }
  }
}

console.log("Star 1:", exploreBackwards(equals(start)))

console.log(
  "Star 2:",
  exploreBackwards((pos) => heights[pos[0]][pos[1]] === 1),
)
