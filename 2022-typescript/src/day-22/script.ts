import readLines from "../helpers/readLines"

type Facing = "N" | "S" | "E" | "W"
type Rotation = "L" | "R"
type Position = [number, number]
type Edge = [Position, Position]
type Join = [Edge, Edge]

const data = readLines(__dirname + "/input.txt")

const instructions = [...data[data.length - 1].matchAll(/\d+|[LR]/g)].map((x) =>
  x[0] === "L" || x[0] === "R" ? x[0] : parseInt(x[0], 10),
)

const mapData = data.slice(0, -2)

const initialFacing: Facing = "E"
const initialPosition: Position = [0, /#|\./.exec(mapData[0])?.index!]

function getTerrain(position: Position) {
  return mapData[position[0]]?.[position[1]] ?? " "
}

function getAdjacentPosition(position: Position, facing: Facing): Position {
  return {
    N: [position[0] - 1, position[1]] as Position,
    S: [position[0] + 1, position[1]] as Position,
    E: [position[0], position[1] + 1] as Position,
    W: [position[0], position[1] - 1] as Position,
  }[facing]
}

function rotate(facing: Facing, rotation: Rotation): Facing {
  return (
    {
      N: {L: "W", R: "E"},
      S: {L: "E", R: "W"},
      E: {L: "N", R: "S"},
      W: {L: "S", R: "N"},
    } as const
  )[facing][rotation]
}

function wrap2D(position: Position, facing: Facing): [Position, Facing] {
  let nextPosition = {
    N: [mapData.length - 1, position[1]] as Position,
    S: [0, position[1]] as Position,
    E: [position[0], 0] as Position,
    W: [position[0], mapData[position[0]].length - 1] as Position,
  }[facing]

  while (getTerrain(nextPosition) === " ") {
    nextPosition = getAdjacentPosition(nextPosition, facing)
  }

  return [nextPosition, facing]
}

// prettier-ignore
const joins: Join[] = [
  [[[  0,  50], [  0,  99]], [[150,   0], [199,   0]]],
  [[[  0, 100], [  0, 149]], [[199,   0], [199,  49]]],
  [[[  0, 149], [ 49, 149]], [[149,  99], [100,  99]]],
  [[[ 50,  99], [ 99,  99]], [[ 49, 100], [ 49, 149]]],
  [[[149,  50], [149,  99]], [[150,  49], [199,  49]]],
  [[[100,   0], [149,   0]], [[ 49,  50], [  0,  50]]],
  [[[ 50,  50], [ 99,  50]], [[100,   0], [100,  49]]],
]

function isBetween(value: number, [min, max]: [number, number]): boolean {
  if (min > max) return isBetween(value, [max, min])
  return value <= max && value >= min
}

function isPerpendicular(facing1: Facing, facing2: Facing) {
  const vertical1 = facing1 === "N" || facing1 === "S"
  const vertical2 = facing2 === "N" || facing2 === "S"
  return vertical1 ? !vertical2 : vertical2
}

function isOnEdge(edge: Edge, position: Position, facing: Facing) {
  if (!isPerpendicular(getEdgeFacing(edge), facing)) return false

  const edgeDimension = edge[0][0] === edge[1][0] ? 0 : 1

  if (edge[0][edgeDimension] !== position[edgeDimension]) return false

  const nonEdgeDimension = edgeDimension === 0 ? 1 : 0

  return isBetween(position[nonEdgeDimension], [
    edge[0][nonEdgeDimension],
    edge[1][nonEdgeDimension],
  ])
}

function findJoin(position: Position, facing: Facing): Join {
  for (const [edge1, edge2] of joins) {
    if (isOnEdge(edge1, position, facing)) return [edge1, edge2]
    if (isOnEdge(edge2, position, facing)) return [edge2, edge1]
  }
  throw new Error("Not on edge")
}

function getEdgeFacing([start, end]: Edge): Facing {
  if (start[0] === end[0]) {
    return start[1] < end[1] ? "W" : "E"
  }
  return start[0] < end[0] ? "N" : "S"
}

function getRotations([edge1, edge2]: Join): Rotation[] {
  const facing1 = getEdgeFacing(edge1)
  const facing2 = getEdgeFacing(edge2)
  if (facing1 === facing2) return []
  if (rotate(facing1, "L") === facing2) return ["L"]
  if (rotate(facing1, "R") === facing2) return ["R"]
  return ["L", "L"]
}

function getStepsAlongEdge(position: Position, edge: Edge): number {
  const nonEdgeDimension = edge[0][0] === edge[1][0] ? 1 : 0
  const step = Math.sign(edge[1][nonEdgeDimension] - edge[0][nonEdgeDimension])
  return (position[nonEdgeDimension] - edge[0][nonEdgeDimension]) / step
}

function stepAlongEdge(edge: Edge, steps: number): Position {
  const nonEdgeDimension = edge[0][0] === edge[1][0] ? 1 : 0
  const step = Math.sign(edge[1][nonEdgeDimension] - edge[0][nonEdgeDimension])

  return nonEdgeDimension === 0
    ? [edge[0][0] + steps * step, edge[0][1]]
    : [edge[0][0], edge[0][1] + steps * step]
}

function wrap3D(position: Position, facing: Facing): [Position, Facing] {
  const [fromEdge, toEdge] = findJoin(position, facing)
  const steps = getStepsAlongEdge(position, fromEdge)
  const nextPosition = stepAlongEdge(toEdge, steps)
  const edgeRotations = getRotations([fromEdge, toEdge])
  const nextFacing = edgeRotations.reduce(rotate, facing)
  return [nextPosition, nextFacing]
}

function getPassword(
  wrap: (position: Position, facing: Facing) => [Position, Facing],
) {
  let position = initialPosition
  let facing = initialFacing

  for (const instruction of instructions) {
    if (instruction === "L" || instruction === "R") {
      facing = rotate(facing, instruction)
    } else {
      for (let i = 0; i < instruction; i++) {
        let nextPosition = getAdjacentPosition(position, facing)
        let nextFacing = facing

        if (getTerrain(nextPosition) === " ") {
          ;[nextPosition, nextFacing] = wrap(position, facing)
        }

        if (getTerrain(nextPosition) === "#") {
          break
        }

        position = nextPosition
        facing = nextFacing
      }
    }
  }

  return (
    1000 * (1 + position[0]) +
    4 * (1 + position[1]) +
    {N: 3, S: 1, E: 0, W: 2}[facing]
  )
}

console.log("Star 1:", getPassword(wrap2D))

console.log("Star 2:", getPassword(wrap3D))
