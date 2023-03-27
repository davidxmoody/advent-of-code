import readLines from "../helpers/readLines"

// This problem went through three different attempts:
//
// 1. Represented world/shapes as arrays of boolean arrays (worked for star 1).
//
// 2. Expected star 2 to be unachievable with pure simulation but wanted to try
//    to see how fast I could make the code anyway. The initial boolean array
//    attempt ran out of memory quickly. I updated it to use a Buffer to
//    represent the world where each row was a byte (first bit ignored). The
//    Buffer cycled back to the start to avoid running out of memory. From
//    running simulations with smaller numbers, I estimate that it would have
//    taken approx 48 hours to do the full 1000000000000 iterations.
//
// 3. Noticed that every time the input did a full cycle, a consistent number
//    of shapes were added which resulted in a consistent height gain (except
//    for the very first cycle which was slightly different). I wrote some
//    hacky code to detect this cycle length and stop early once enough data
//    had been collected.

type Direction = "<" | ">"

type World = Buffer // each byte is a row (first bit of each byte is ignored)

interface Shape {
  rows: number[] // byte array, starting from bottom (first bit ignored)
  width: number
}

const input = readLines(__dirname + "/input.txt")[0].split("") as Direction[]

const worldMaxSize = 1000

const shapes: Shape[] = [
  // ####...
  {
    rows: [0b1111000],
    width: 4,
  },

  // .#.....
  // ###....
  // .#.....
  {
    rows: [0b0100000, 0b1110000, 0b0100000],
    width: 3,
  },

  // ..#....
  // ..#....
  // ###....
  {
    rows: [0b1110000, 0b0010000, 0b0010000],
    width: 3,
  },

  // #......
  // #......
  // #......
  // #......
  {
    rows: [0b1000000, 0b1000000, 0b1000000, 0b1000000],
    width: 1,
  },

  // ##.....
  // ##.....
  {
    rows: [0b1100000, 0b1100000],
    width: 2,
  },
]

function doesShapeFit(
  y: number,
  x: number,
  shape: Shape,
  world: World,
): boolean {
  if (y < 0 || x < 0 || x + shape.width > 7) return false

  return shape.rows.every(
    (shapeRow, rowIndex) =>
      !((shapeRow >> x) & world[(y + rowIndex) % worldMaxSize]),
  )
}

function commitShapeToWorld(y: number, x: number, shape: Shape, world: World) {
  shape.rows.forEach((shapeRow, rowIndex) => {
    const bufferIndex = (y + rowIndex) % worldMaxSize
    world[bufferIndex] = world[bufferIndex] | (shapeRow >> x)
  })
}

// function printWorld(world: World) {
//   for (let i = 40; i >= 0; i--) {
//     console.log(
//       world[i]
//         .toString(2)
//         .padStart(7, "0")
//         .replaceAll("0", ".")
//         .replaceAll("1", "#"),
//     )
//   }
// }

function simulate(numShapes: number) {
  const world: World = Buffer.alloc(worldMaxSize)
  let inputIndex = 0

  let numFilledRows = 0
  let cycle1: {numShapes: number; numFilledRows: number} | null = null
  let cycle2: {numShapes: number; numFilledRows: number} | null = null

  for (let shapeIndex = 0; shapeIndex < numShapes; shapeIndex++) {
    let shape = shapes[shapeIndex % shapes.length]
    let shapeY = numFilledRows + 3
    let shapeX = 2
    for (let h = numFilledRows; h <= shapeY + 3; h++) {
      world[h % worldMaxSize] = 0b0000000
    }

    while (true) {
      const maybeNextShapeX =
        input[inputIndex % input.length] === "<" ? shapeX - 1 : shapeX + 1
      if (doesShapeFit(shapeY, maybeNextShapeX, shape, world)) {
        shapeX = maybeNextShapeX
      }
      inputIndex++

      if (inputIndex % input.length === 0) {
        if (!cycle1) {
          cycle1 = {numShapes: shapeIndex, numFilledRows: numFilledRows}
        } else if (!cycle2) {
          cycle2 = {
            numShapes: shapeIndex - cycle1.numShapes,
            numFilledRows: numFilledRows - cycle1.numFilledRows,
          }
        }
      }

      if (cycle2 && (numShapes - shapeIndex) % cycle2.numShapes === 0) {
        const numRemainingCycles = (numShapes - shapeIndex) / cycle2.numShapes
        return {
          world,
          numFilledRows:
            numFilledRows + numRemainingCycles * cycle2.numFilledRows,
        }
      }

      if (doesShapeFit(shapeY - 1, shapeX, shape, world)) {
        shapeY--
      } else {
        break
      }
    }

    commitShapeToWorld(shapeY, shapeX, shape, world)
    numFilledRows = Math.max(numFilledRows, shapeY + shape.rows.length)
  }

  return {world, numFilledRows}
}

console.log("Star 1:", simulate(2022).numFilledRows)

console.log("Star 2:", simulate(1000000000000).numFilledRows)
