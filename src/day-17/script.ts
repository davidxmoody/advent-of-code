import readLines from "../helpers/readLines"

type Direction = "<" | ">" | "down"
type Vector = [number, number] // y, x
type Position = [number, number] // y, x
type Shape = Vector[]
type World = boolean[][] // y, x

const input = readLines(__dirname + "/input.txt")[0].split("") as Direction[]

const directionVectors: Record<Direction, Vector> = {
  "<": [0, -1],
  ">": [0, 1],
  down: [-1, 0],
}

const shapes: Shape[] = [
  // ####
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],

  // .#.
  // ###
  // .#.
  [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 1],
  ],

  // ..#
  // ..#
  // ###
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],

  // #
  // #
  // #
  // #
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],

  // ##
  // ##
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
]

function isEmpty(position: Position, world: World): boolean {
  return !world[position[0]]?.[position[1]]
}

function move(position: Position, vector: Vector): Position {
  return [position[0] + vector[0], position[1] + vector[1]]
}

function canShapeMove(
  shape: Shape,
  position: Position,
  direction: Direction,
  world: World,
): boolean {
  const nextPosition = move(position, directionVectors[direction])
  const shapePiecePositions = shape.map((v) => move(nextPosition, v))
  return shapePiecePositions.every(
    (p) => p[0] >= 0 && p[1] >= 0 && p[1] < 7 && isEmpty(p, world),
  )
}

function commitShapeToWorld(shape: Shape, position: Position, world: World) {
  const shapePiecePositions = shape.map((v) => move(position, v))
  const maxY = Math.max(
    world.length - 1,
    ...shapePiecePositions.map((p) => p[0]),
  )

  while (world.length - 1 < maxY) {
    world.push([false, false, false, false, false, false, false])
  }

  for (const [y, x] of shapePiecePositions) {
    world[y][x] = true
  }
}

function printWorld(world: World) {
  for (const row of [...world].reverse()) {
    console.log(row.map((b) => (b ? "#" : ".")).join(""))
  }
}

function simulate(numShapes: number): World {
  const world: World = []
  let inputIndex = 0

  for (let shapeIndex = 0; shapeIndex < numShapes; shapeIndex++) {
    if (shapeIndex % 100 === 0) console.log(shapeIndex)
    const shape = shapes[shapeIndex % shapes.length]
    let shapePosition: Position = [world.length + 3, 2]

    while (true) {
      const blowDirection = input[inputIndex % input.length]
      const canBeBlown = canShapeMove(
        shape,
        shapePosition,
        blowDirection,
        world,
      )
      if (canBeBlown) {
        shapePosition = move(shapePosition, directionVectors[blowDirection])
      }
      inputIndex++

      const canFallDown = canShapeMove(shape, shapePosition, "down", world)
      if (canFallDown) {
        shapePosition = move(shapePosition, directionVectors.down)
      } else {
        break
      }
    }

    commitShapeToWorld(shape, shapePosition, world)
  }

  return world
}

console.log("Star 1:", simulate(2022).length)
// console.log("Star 1:", simulate(1000000000000).length)
