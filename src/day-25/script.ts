import readLines from "../helpers/readLines"

const snafuNumbers = readLines(__dirname + "/input.txt")

function parseSnafu(sNum: string): number {
  return sNum
    .split("")
    .map(
      (char, index) =>
        ({2: 2, 1: 1, 0: 0, "-": -1, "=": -2}[char]! *
        Math.pow(5, sNum.length - index - 1)),
    )
    .reduce((a, b) => a + b, 0)
}

function toSnafu(num: number, ...digitsSoFar: string[]): string {
  if (num === 0) return digitsSoFar.join("")
  const nextDigit = {0: "0", 1: "1", 2: "2", 3: "=", 4: "-"}[num % 5]!
  const remainder =
    nextDigit === "-" || nextDigit === "="
      ? Math.ceil(num / 5)
      : Math.floor(num / 5)
  return toSnafu(remainder, nextDigit, ...digitsSoFar)
}

const snafuTotal = toSnafu(snafuNumbers.map(parseSnafu).reduce((a, b) => a + b))

console.log("Star 1:", snafuTotal)
