import readLines from "../helpers/readLines"

type Instruction = {type: "noop"} | {type: "addx"; value: number}

const instructions: Instruction[] = readLines(__dirname + "/input.txt").map(
  (line) =>
    line.startsWith("noop")
      ? {type: "noop"}
      : {type: "addx", value: parseInt(line.slice(5), 10)},
)

let xRegister = 1
const xHistory: number[] = []

for (const instruction of instructions) {
  if (instruction.type === "noop") {
    xHistory.push(xRegister)
  } else {
    xHistory.push(xRegister, xRegister)
    xRegister += instruction.value
  }
}

const star1Answer = [20, 60, 100, 140, 180, 220]
  .map((cycleNumber) => xHistory[cycleNumber - 1] * cycleNumber)
  .reduce((a, b) => a + b, 0)

console.log("Star 1:", star1Answer)

let screenOutput = ""

for (let y = 0; y < 6; y++) {
  for (let x = 0; x < 40; x++) {
    const cycleIndex = y * 40 + x
    const draw = Math.abs(xHistory[cycleIndex] - x) <= 1
    screenOutput += draw ? "#" : "."
  }
  screenOutput += "\n"
}

console.log(`\nStar 2:\n\n${screenOutput}`)
