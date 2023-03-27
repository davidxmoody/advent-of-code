import readLines from "../helpers/readLines"

const depths = readLines(__dirname + "/input.txt").map((line) =>
  parseInt(line, 10),
)

function countIncreases(data: number[], chunkSize = 1) {
  let numIncreases = 0
  for (let i = chunkSize; i < data.length; i++) {
    if (data[i] > data[i - chunkSize]) numIncreases++
  }
  return numIncreases
}

console.log("Star 1:", countIncreases(depths))

console.log("Star 2:", countIncreases(depths, 3))
