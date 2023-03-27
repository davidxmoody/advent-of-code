import * as fs from "fs"
import chalk from "chalk"

type Direction = "<" | ">" | "^" | "v"

interface Cart {
  x: number
  y: number
  numTurns: number
  direction: Direction
}

type Track = "|" | "-" | "/" | "\\" | "+"
type Grid = Array<Array<Track | null>>

interface State {
  grid: Grid
  carts: Cart[]
}

function getInitialState(input: string): State {
  const carts: Cart[] = []

  const grid: Grid = input.split("\n").map((row, y) =>
    row.split("").map(
      (cell, x): Track | null => {
        switch (cell) {
          case "|":
          case "-":
          case "/":
          case "\\":
          case "+":
            return cell
          case ">":
          case "<":
            carts.push({y, x, numTurns: 0, direction: cell})
            return "-"
          case "^":
          case "v":
            carts.push({y, x, numTurns: 0, direction: cell})
            return "|"
          default:
            return null
        }
      },
    ),
  )

  return {carts, grid}
}

function checkCollisions(state: State): void {
  const positionMap: Record<string, boolean | undefined> = {}
  for (const cart of state.carts) {
    const position = `${cart.x},${cart.y}`
    if (positionMap[position]) {
      throw new Error(`Collision: ${position}`)
    }
    positionMap[position] = true
  }
}

function iterate(state: State): void {
  state.carts.sort(
    (a, b) =>
      a.y < b.y ? -1 : a.y > b.y ? 1 : a.x < b.x ? -1 : a.x > b.x ? 1 : 0,
  )

  for (const cart of state.carts) {
    const currentTrack = state.grid[cart.y][cart.x]
    switch (currentTrack) {
      case "-":
        if (cart.direction === "<") {
          cart.x--
        } else if (cart.direction === ">") {
          cart.x++
        } else {
          throw new Error(
            `Invalid direction/track combination: ${JSON.stringify(
              cart,
            )}, ${currentTrack}`,
          )
        }
        break

      case "|":
        if (cart.direction === "v") {
          cart.y++
        } else if (cart.direction === "^") {
          cart.y--
        } else {
          throw new Error(
            `Invalid direction/track combination: ${JSON.stringify(
              cart,
            )}, ${currentTrack}`,
          )
        }
        break

      case "+":
        if (cart.direction === "v") {
          // TODO add turning logic here
          cart.y++
        } else if (cart.direction === "^") {
          cart.y--
        } else if (cart.direction === "<") {
          cart.x--
        } else if (cart.direction === ">") {
          cart.x++
        } else {
          throw new Error(
            `Invalid direction/track combination: ${JSON.stringify(
              cart,
            )}, ${currentTrack}`,
          )
        }
        break

      case "/":
        if (cart.direction === "v") {
          cart.x--
          cart.direction = "<"
        } else if (cart.direction === "^") {
          cart.x++
          cart.direction = ">"
        } else if (cart.direction === "<") {
          cart.y++
          cart.direction = "v"
        } else if (cart.direction === ">") {
          cart.y--
          cart.direction = "^"
        } else {
          throw new Error(
            `Invalid direction/track combination: ${JSON.stringify(
              cart,
            )}, ${currentTrack}`,
          )
        }
        break

      case "\\":
        if (cart.direction === "v") {
          cart.x++
          cart.direction = ">"
        } else if (cart.direction === "^") {
          cart.x--
          cart.direction = "<"
        } else if (cart.direction === "<") {
          cart.y--
          cart.direction = "^"
        } else if (cart.direction === ">") {
          cart.y++
          cart.direction = "v"
        } else {
          throw new Error(
            `Invalid direction/track combination: ${JSON.stringify(
              cart,
            )}, ${currentTrack}`,
          )
        }
        break
    }

    checkCollisions(state)
  }
}

function printState(state: State): void {
  let output = ""

  for (let y = 0; y < state.grid.length; y++) {
    for (let x = 0; x < state.grid[0].length; x++) {
      const currentCarts = state.carts.filter(c => c.x === x && c.y === y)
      if (currentCarts.length === 0) {
        output += state.grid[y][x] || " "
      } else if (currentCarts.length === 1) {
        output += chalk.black.bgCyan(currentCarts[0].direction)
      } else {
        output += chalk.black.bgYellow("X")
      }
    }
    output += "\n"
  }

  console.log("\n".repeat(100))
  console.log(output)
}

function delay(timeInMs: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, timeInMs)
  })
}

async function run() {
  // const data = fs.readFileSync(__dirname + "/data.txt", "utf8")
  const data = fs.readFileSync(__dirname + "/simple-data.txt", "utf8")
  const state = getInitialState(data)

  try {
    while (true) {
      printState(state)
      await delay(100)
      iterate(state)
    }
  } catch (e) {
    printState(state)
    console.log(e)
  }
}

run()

// It's not 38,13
