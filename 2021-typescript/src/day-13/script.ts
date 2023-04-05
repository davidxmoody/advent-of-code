import readLines from "../helpers/readLines"

const points = new Set<string>()

const folds: Array<{dimension: "x" | "y"; along: number}> = []

readLines(__dirname + "/input.txt").forEach((line) => {
  const pointMatch = line.match(/^\d+,\d+$/)
  if (pointMatch) points.add(line)

  const foldMatch = line.match(/^fold along ([xy])=(\d+)$/)
  if (foldMatch)
    folds.push({
      dimension: foldMatch[1] as "x" | "y",
      along: parseInt(foldMatch[2], 10),
    })
})

for (let i = 0; i < folds.length; i++) {
  const fold = folds[i]

  for (const point of points) {
    const [x, y] = point.split(",").map((n) => parseInt(n, 10))

    if (fold.dimension === "x" && x > fold.along) {
      points.delete(point)
      points.add(`${2 * fold.along - x},${y}`)
    }

    if (fold.dimension === "y" && y > fold.along) {
      points.delete(point)
      points.add(`${x},${2 * fold.along - y}`)
    }
  }

  if (i === 0) console.log("Star 1:", points.size)
}

let maxX = 0
let maxY = 0
const paper: boolean[][] = []

for (const point of points) {
  const [x, y] = point.split(",").map((n) => parseInt(n, 10))
  paper[y] = paper[y] ?? []
  paper[y][x] = true
  maxX = Math.max(maxX, x)
  maxY = Math.max(maxY, y)
}

let output = ""
for (let y = 0; y <= maxY; y++) {
  for (let x = 0; x <= maxX; x++) {
    output += paper[y][x] ? "#" : " "
  }
  output += "\n"
}

console.log(`\nStar 2:\n\n${output}`)
