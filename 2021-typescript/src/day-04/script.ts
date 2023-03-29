import readLines from "../helpers/readLines"

type BingoBoard = Array<Array<number | "X">>

const lines = readLines(__dirname + "/input.txt")

const drawnNumbers = lines
  .shift()!
  .split(",")
  .map((x) => parseInt(x, 10))

const bingoBoards: Array<BingoBoard | null> = []

for (const line of lines) {
  if (line === "") {
    bingoBoards.push([])
  } else {
    const lineNumbers = line
      .split(/ +/)
      .filter((x) => x)
      .map((x) => parseInt(x, 10))
    bingoBoards[bingoBoards.length - 1]!.push(lineNumbers)
  }
}

function markNumber(board: BingoBoard, num: number) {
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (board[y][x] === num) {
        board[y][x] = "X"
        return
      }
    }
  }
}

function isCompleted(board: BingoBoard) {
  for (let y = 0; y < 5; y++) {
    if ([0, 1, 2, 3, 4].every((x) => board[y][x] === "X")) return true
  }
  for (let x = 0; x < 5; x++) {
    if ([0, 1, 2, 3, 4].every((y) => board[y][x] === "X")) return true
  }
}

function calculateScore(board: BingoBoard, lastNumber: number) {
  const boardUnmarkedTotal = board
    .flat()
    .reduce((acc: number, num) => (num === "X" ? acc : acc + num), 0)
  return boardUnmarkedTotal * lastNumber
}

const boardScores: number[] = []

for (const drawnNumber of drawnNumbers) {
  for (let i = 0; i < bingoBoards.length; i++) {
    const board = bingoBoards[i]
    if (!board) continue

    markNumber(board, drawnNumber)

    if (isCompleted(board)) {
      boardScores.push(calculateScore(board, drawnNumber))
      bingoBoards[i] = null
    }
  }
}

console.log("Star 1:", boardScores[0])
console.log("Star 2:", boardScores[boardScores.length - 1])
