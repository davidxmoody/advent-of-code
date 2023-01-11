import readLines from "../helpers/readLines"

const lines = readLines(__dirname + "/input.txt")

const stacks: Record<string, Array<string>> = {}
const moves: Array<{num: number; from: number; to: number}> = []

for (const line of lines) {
  const moveMatch = /^move (\d+) from (\d) to (\d)$/.exec(line)

  if (!moveMatch) {
    for (let i = 1; i <= 9; i++) {
      if (line[(i - 1) * 4] === "[") {
        stacks[i] = [line[(i - 1) * 4 + 1], ...(stacks[i] ?? [])]
      }
    }
  } else {
    const num = parseInt(moveMatch[1], 10)
    const from = parseInt(moveMatch[2], 10)
    const to = parseInt(moveMatch[3], 10)
    moves.push({num, from, to})
  }
}

function simulate(
  moveFn: (stacksClone: typeof stacks, move: typeof moves[number]) => void,
) {
  const stacksClone = JSON.parse(JSON.stringify(stacks))

  for (const move of moves) {
    moveFn(stacksClone, move)
  }

  let topChars = ""
  for (let i = 1; i <= 9; i++) {
    topChars += stacksClone[i][stacksClone[i].length - 1]
  }
  return topChars
}

const star1Answer = simulate((stacksClone, move) => {
  for (let i = 0; i < move.num; i++) {
    stacksClone[move.to].push(stacksClone[move.from].pop()!)
  }
})

console.log("Star 1:", star1Answer)

const star2Answer = simulate((stacksClone, move) => {
  stacksClone[move.to].push(
    ...stacksClone[move.from].splice(
      stacksClone[move.from].length - move.num,
      move.num,
    ),
  )
})

console.log("Star 2:", star2Answer)
