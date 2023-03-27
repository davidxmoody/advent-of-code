import readLines from "../helpers/readLines"

const rounds = readLines(__dirname + "/input.txt").map(
  (line) => line.split(" ") as ["A" | "B" | "C", "X" | "Y" | "Z"],
)

type Move = "rock" | "paper" | "scissors"
type Result = "win" | "loss" | "draw"

const outcomes: Array<[Move, Move, Result]> = [
  ["rock", "rock", "draw"],
  ["rock", "paper", "loss"],
  ["rock", "scissors", "win"],
  ["paper", "rock", "win"],
  ["paper", "paper", "draw"],
  ["paper", "scissors", "loss"],
  ["scissors", "rock", "loss"],
  ["scissors", "paper", "win"],
  ["scissors", "scissors", "draw"],
]

const moveScoreTable: Record<Move, number> = {
  rock: 1,
  paper: 2,
  scissors: 3,
}

const resultScoreTable: Record<Result, number> = {
  win: 6,
  loss: 0,
  draw: 3,
}

const star1Answer = rounds
  .map(([opMoveCode, myMoveCode]) => {
    const opMove = ({A: "rock", B: "paper", C: "scissors"} as const)[opMoveCode]
    const myMove = ({X: "rock", Y: "paper", Z: "scissors"} as const)[myMoveCode]

    const result = outcomes.find(
      ([myM, opM, _res]) => myM === myMove && opM === opMove,
    )![2]

    return moveScoreTable[myMove] + resultScoreTable[result]
  })
  .reduce((a, b) => a + b, 0)

console.log("Star 1:", star1Answer)

const star2Answer = rounds
  .map(([opMoveCode, resultCode]) => {
    const opMove = ({A: "rock", B: "paper", C: "scissors"} as const)[opMoveCode]
    const result = ({X: "loss", Y: "draw", Z: "win"} as const)[resultCode]

    const myMove = outcomes.find(
      ([_myM, opM, res]) => opM === opMove && res === result,
    )![0]

    return moveScoreTable[myMove] + resultScoreTable[result]
  })
  .reduce((a, b) => a + b, 0)

console.log("Star 2:", star2Answer)
