import readLines from "../helpers/readLines"

type Pair = [number | Pair, number | Pair]

const pairs: Pair[] = readLines(__dirname + "/input.txt").map((line) =>
  JSON.parse(line),
)

function clonePair(pair: Pair): Pair {
  return JSON.parse(JSON.stringify(pair))
}

function findPathOfDepthFour(
  pair: Pair | number,
  pathSoFar: number[] = [],
): number[] | null {
  if (typeof pair === "number") {
    return null
  }

  if (
    typeof pair[0] === "number" &&
    typeof pair[1] === "number" &&
    pathSoFar.length >= 4
  ) {
    return pathSoFar
  }

  return (
    findPathOfDepthFour(pair[0], [...pathSoFar, 0]) ||
    findPathOfDepthFour(pair[1], [...pathSoFar, 1]) ||
    null
  )
}

function getAtPath(pair: Pair, [head, ...tail]: number[]): Pair | number {
  if (tail.length === 0) return pair[head]
  return getAtPath(pair[head] as Pair, tail)
}

function setAtPath(
  pair: Pair,
  [head, ...tail]: number[],
  value: Pair | number,
) {
  if (tail.length === 0) {
    pair[head] = value
  } else {
    setAtPath(pair[head] as Pair, tail, value)
  }
}

function step(pair: Pair, path: number[], dir: 0 | 1): number[] | null {
  const currentPath = [...path]

  while (currentPath[currentPath.length - 1] === dir) {
    currentPath.pop()
  }

  if (currentPath.length === 0) return null

  currentPath[currentPath.length - 1] = dir

  while (typeof getAtPath(pair, currentPath) !== "number") {
    currentPath.push(dir === 0 ? 1 : 0)
  }

  return currentPath
}

function findPathOfValueTenOrMore(
  pair: Pair | number,
  pathSoFar: number[] = [],
): number[] | null {
  if (typeof pair === "number") return pair >= 10 ? pathSoFar : null

  return (
    findPathOfValueTenOrMore(pair[0], [...pathSoFar, 0]) ||
    findPathOfValueTenOrMore(pair[1], [...pathSoFar, 1]) ||
    null
  )
}

function reduce(pair: Pair): Pair {
  const pathToExplode = findPathOfDepthFour(pair)
  if (pathToExplode) {
    const [leftValue, rightValue] = getAtPath(pair, pathToExplode) as Pair
    setAtPath(pair, pathToExplode, 0)

    const leftPath = step(pair, pathToExplode, 0)
    if (leftPath) {
      setAtPath(
        pair,
        leftPath,
        (getAtPath(pair, leftPath) as number) + (leftValue as number),
      )
    }

    const rightPath = step(pair, pathToExplode, 1)
    if (rightPath) {
      setAtPath(
        pair,
        rightPath,
        (getAtPath(pair, rightPath) as number) + (rightValue as number),
      )
    }
    return reduce(pair)
  }

  const pathToSplit = findPathOfValueTenOrMore(pair)
  if (pathToSplit) {
    const splitValue = getAtPath(pair, pathToSplit) as number
    setAtPath(pair, pathToSplit, [
      Math.floor(splitValue / 2),
      Math.ceil(splitValue / 2),
    ])
    return reduce(pair)
  }

  return pair
}

function addPairs(pair1: Pair, pair2: Pair): Pair {
  return reduce([clonePair(pair1), clonePair(pair2)])
}

function getMagnitude(pair: Pair | number): number {
  if (typeof pair === "number") return pair
  return getMagnitude(pair[0]) * 3 + getMagnitude(pair[1]) * 2
}

console.log("Star 1:", getMagnitude(pairs.reduce(addPairs)))

let greatestMagnitude = 0

for (let i = 0; i < pairs.length; i++) {
  for (let j = 0; j < pairs.length; j++) {
    if (i === j) continue

    const magnitude = getMagnitude(addPairs(pairs[i], pairs[j]))
    greatestMagnitude = Math.max(greatestMagnitude, magnitude)
  }
}

console.log("Star 2:", greatestMagnitude)
