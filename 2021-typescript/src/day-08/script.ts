import readLines from "../helpers/readLines"

const data = readLines(__dirname + "/input.txt").map((line) =>
  line.split(" | ").map((section) => section.split(" ")),
)

function flip<K extends string, V extends number>(
  obj: Record<K, V>,
): Record<V, K> {
  return Object.fromEntries(Object.entries(obj).map(([a, b]) => [b, a]))
}

const correctDigits: Record<string, number> = {
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  acdfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9,
}

function getFingerprint(digits: string[]) {
  const fingerprint: Record<string, number> = {
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 1,
    f: 1,
    g: 1,
  }

  for (const digit of digits) {
    for (const letter of digit.split("")) {
      fingerprint[letter] *= digit.length
    }
  }

  return fingerprint
}

const correctDigitLookup = flip(getFingerprint(Object.keys(correctDigits)))

function decode([digitsBefore, digitsAfter]: string[][]): number[] {
  const fingerprint = getFingerprint(digitsBefore)

  return digitsAfter.map((digit) => {
    const correctDigit = digit
      .split("")
      .map((letter) => correctDigitLookup[fingerprint[letter]])
      .sort()
      .join("")
    return correctDigits[correctDigit]
  })
}

const decodedOutput = data.map(decode)

console.log(
  "Star 1:",
  decodedOutput.flat().filter((x) => x === 1 || x === 4 || x === 7 || x === 8)
    .length,
)

console.log(
  "Star 2:",
  decodedOutput
    .map(([a, b, c, d]) => 1000 * a + 100 * b + 10 * c + d)
    .reduce((a, b) => a + b),
)
