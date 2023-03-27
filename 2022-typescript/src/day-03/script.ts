import readLines from "../helpers/readLines"

const data = readLines(__dirname + "/input.txt")

const orderedChars =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

function getPriority(char: string) {
  return orderedChars.indexOf(char) + 1
}

function findCommonChar(strings: string[]) {
  return orderedChars.find((char) =>
    strings.every((str) => str.includes(char)),
  )!
}

function splitString(str: string): [string, string] {
  return [str.substring(0, str.length / 2), str.substring(str.length / 2)]
}

const star1Answer = data
  .map(splitString)
  .map(findCommonChar)
  .map(getPriority)
  .reduce((a, b) => a + b, 0)

console.log("Star 1:", star1Answer)

function chunk(list: string[], size: number) {
  const result = []
  for (let i = 0; i < list.length; i += size) {
    result.push(list.slice(i, i + size))
  }
  return result
}

const star2Answer = chunk(data, 3)
  .map(findCommonChar)
  .map(getPriority)
  .reduce((a, b) => a + b, 0)

console.log("Star 2:", star2Answer)
