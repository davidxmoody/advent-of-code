import readLines from "../helpers/readLines"

const openingChars = ["(", "[", "{", "<"]
const closingChars = [")", "]", "}", ">"]

function getClosingChar(openingChar: string) {
  return closingChars[openingChars.indexOf(openingChar)]
}

const illegalCharScores: Record<string, number> = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
}

const completionCharScores: Record<string, number> = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
}

const lines = readLines(__dirname + "/input.txt").map((line) => {
  const stack: string[] = []

  for (const char of line.split("")) {
    if (openingChars.includes(char)) {
      stack.push(char)
    } else if (char === getClosingChar(stack[stack.length - 1])) {
      stack.pop()
    } else {
      return {type: "corrupted", score: illegalCharScores[char]} as const
    }
  }

  if (stack.length) {
    const completingChars = stack.map(getClosingChar).reverse()
    const score = completingChars.reduce(
      (acc, char) => acc * 5 + completionCharScores[char],
      0,
    )
    return {type: "incomplete", score} as const
  }
})

console.log(
  "Star 1:",
  lines.reduce(
    (acc, line) => (line?.type === "corrupted" ? acc + line.score : acc),
    0,
  ),
)

const incompleteScores = lines
  .filter((line) => line?.type === "incomplete")
  .map((line) => line!.score)
  .sort((a, b) => a - b)

console.log("Star 2:", incompleteScores[(incompleteScores.length - 1) / 2])
