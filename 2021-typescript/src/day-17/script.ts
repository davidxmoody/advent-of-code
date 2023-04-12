import readLines from "../helpers/readLines"

const match = readLines(__dirname + "/input.txt")[0].match(
  /^target area: x=([0-9-]+)..([0-9-]+), y=([0-9-]+)..([0-9-]+)/,
)!

const xMin = parseInt(match[1])
const xMax = parseInt(match[2])
const yLowest = parseInt(match[3])
const yHighest = parseInt(match[4])

function simulate(startingXVel: number, startingYVel: number) {
  let xPos = 0
  let yPos = 0

  let xVel = startingXVel
  let yVel = startingYVel

  let highestReachedYPos = 0

  while (xPos <= xMax && yPos >= yLowest) {
    if (xPos >= xMin && yPos <= yHighest) {
      return highestReachedYPos
    }

    xPos += xVel
    yPos += yVel
    xVel = Math.max(0, xVel - 1)
    yVel--
    highestReachedYPos = Math.max(highestReachedYPos, yPos)
  }

  return null
}

let bestHighestPosition = 0
let numValidVelocities = 0

for (let xVel = 1; xVel <= xMax; xVel++) {
  for (let yVel = yLowest; yVel < 1000; yVel++) {
    const result = simulate(xVel, yVel)
    if (result !== null) {
      bestHighestPosition = Math.max(bestHighestPosition, result)
      numValidVelocities++
    }
  }
}

console.log("Star 1:", bestHighestPosition)

console.log("Star 2:", numValidVelocities)
