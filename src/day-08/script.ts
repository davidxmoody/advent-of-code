import readLines from "../helpers/readLines"

const treeHeights = readLines(__dirname + "/input.txt").map((line) =>
  line.split("").map((x) => parseInt(x, 10)),
)

const directionVectors = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

const treeVisibility = treeHeights.map((row) => row.map(() => false))
const scenicScores = treeHeights.map((row) => row.map(() => 1))

for (let y = 0; y < treeHeights.length; y++) {
  for (let x = 0; x < treeHeights[0].length; x++) {
    for (const [dy, dx] of directionVectors) {
      let currentY = y
      let currentX = x

      let isObscured = false
      let numTrees = 0

      while (true) {
        currentY += dy
        currentX += dx

        if (
          currentY < 0 ||
          currentY >= treeHeights.length ||
          currentX < 0 ||
          currentX >= treeHeights[0].length
        ) {
          break
        }

        numTrees++

        if (treeHeights[currentY][currentX] >= treeHeights[y][x]) {
          isObscured = true
          break
        }
      }

      if (!isObscured) {
        treeVisibility[y][x] = true
      }

      scenicScores[y][x] = scenicScores[y][x] * numTrees
    }
  }
}

const numVisible = treeVisibility.flat().filter((x) => x).length

console.log("Star 1:", numVisible)

const highestScenicScore = scenicScores
  .flat()
  .reduce((acc, value) => (value > acc ? value : acc), 0)

console.log("Star 2:", highestScenicScore)
