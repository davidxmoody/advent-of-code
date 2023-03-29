import readLines from "../helpers/readLines"

const binaryNumbers = readLines(__dirname + "/input.txt")
const numberLength = binaryNumbers[0].length

function findMostAndLeastCommonBits(index: number, numbers: string[]) {
  const oneCount = numbers.filter((num) => num[index] === "1").length
  return oneCount >= numbers.length / 2
    ? {most: "1", least: "0"}
    : {most: "0", least: "1"}
}

let gamma = ""
let epsilon = ""

for (let i = 0; i < numberLength; i++) {
  const {most, least} = findMostAndLeastCommonBits(i, binaryNumbers)
  gamma += most
  epsilon += least
}

console.log("Star 1:", parseInt(gamma, 2) * parseInt(epsilon, 2))

function findClosestMatch(kind: "most" | "least") {
  let numbers = binaryNumbers
  for (let i = 0; i < numberLength; i++) {
    const desiredBit = findMostAndLeastCommonBits(i, numbers)[kind]
    numbers = numbers.filter((num) => num[i] === desiredBit)
    if (numbers.length === 1) return numbers[0]
  }
  throw new Error("Could not find match")
}

console.log(
  "Star 2:",
  parseInt(findClosestMatch("most"), 2) *
    parseInt(findClosestMatch("least"), 2),
)
