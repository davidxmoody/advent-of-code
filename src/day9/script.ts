import readLines from "../helpers/readLines"

type CardinalDirection = "U" | "D" | "L" | "R"
type Vector = [number, number]
type Position = [number, number]

const cardinalDirectionVectors: Record<CardinalDirection, Vector> = {
  U: [1, 0],
  D: [-1, 0],
  L: [0, -1],
  R: [0, 1],
}

const moves = readLines(__dirname + "/input.txt").map((line) => {
  const match = /^([UDLR]) (\d+)$/.exec(line)
  if (!match) throw new Error("Failed to parse")
  return [match[1] as CardinalDirection, parseInt(match[2], 10)] as const
})

function moveSegment(
  [headPos, tailPos]: [Position, Position],
  vector: Vector,
): [Position, Position] {
  const newHeadPos: Position = [headPos[0] + vector[0], headPos[1] + vector[1]]

  const yGap = Math.abs(newHeadPos[0] - tailPos[0])
  const xGap = Math.abs(newHeadPos[1] - tailPos[1])

  if (yGap <= 1 && xGap <= 1) {
    return [newHeadPos, tailPos]
  }

  if (yGap === 2 || xGap === 2) {
    const yStep = Math.sign(newHeadPos[0] - tailPos[0])
    const xStep = Math.sign(newHeadPos[1] - tailPos[1])
    const newTailPos: Position = [tailPos[0] + yStep, tailPos[1] + xStep]
    return [newHeadPos, newTailPos]
  }

  throw new Error("Unexpected movement")
}

function moveRope(parts: Position[], vector: Vector): Position[] {
  if (parts.length <= 1) {
    throw new Error("Rope too small")
  }

  if (parts.length === 2) {
    return moveSegment([parts[0], parts[1]], vector)
  }

  const firstSegment = parts.slice(0, 2) as [Position, Position]
  const newFirstSegment = moveSegment(firstSegment, vector)

  const subsequentVector: Vector = [
    newFirstSegment[1][0] - firstSegment[1][0],
    newFirstSegment[1][1] - firstSegment[1][1],
  ]

  return [newFirstSegment[0], ...moveRope(parts.slice(1), subsequentVector)]
}

function countUniquePositions(positions: Position[]) {
  return new Set(positions.map((x) => JSON.stringify(x))).size
}

function simulateRope(ropeLength: number) {
  let currentRopePosition: Position[] = Array(ropeLength).fill([0, 0])
  const visitedTailPositions: Position[] = []

  for (const [direction, count] of moves) {
    for (let i = 0; i < count; i++) {
      currentRopePosition = moveRope(
        currentRopePosition,
        cardinalDirectionVectors[direction],
      )
      visitedTailPositions.push(
        currentRopePosition[currentRopePosition.length - 1],
      )
    }
  }

  return countUniquePositions(visitedTailPositions)
}

console.log("Star 1:", simulateRope(2))

console.log("Star 2:", simulateRope(10))
