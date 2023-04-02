import readLines from "../helpers/readLines"

const fishAges = readLines(__dirname + "/input.txt")[0]
  .split(",")
  .map((x) => parseInt(x, 10))

let fishCounts = fishAges.reduce((counts, age) => {
  counts[age] = (counts[age] ?? 0) + 1
  return counts
}, [] as number[])

function sum(list: number[]) {
  return list.reduce((a, b) => a + b, 0)
}

for (let i = 1; i <= 256; i++) {
  const zeros = fishCounts.shift() ?? 0
  fishCounts[6] = (fishCounts[6] ?? 0) + zeros
  fishCounts[8] = (fishCounts[8] ?? 0) + zeros

  if (i === 80) console.log("Star 1:", sum(fishCounts))
  if (i === 256) console.log("Star 2:", sum(fishCounts))
}
