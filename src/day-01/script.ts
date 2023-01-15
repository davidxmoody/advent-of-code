import readLines from "../helpers/readLines"

const groups: number[][] = [[]]

for (const line of readLines(__dirname + "/input.txt")) {
  if (line) {
    groups[groups.length - 1].push(parseFloat(line))
  } else {
    groups.push([])
  }
}

function sum(numbers: number[]) {
  return numbers.reduce((a, b) => a + b, 0)
}

const descendingTotals = groups.map(sum).sort((a, b) => b - a)

console.log("Star 1:", descendingTotals[0])

console.log("Star 2:", sum(descendingTotals.slice(0, 3)))
