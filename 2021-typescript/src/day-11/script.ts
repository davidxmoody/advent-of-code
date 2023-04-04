import readLines from "../helpers/readLines"

type Point = [number, number] // y, x

const octos = readLines(__dirname + "/input.txt").map((line) =>
  line.split("").map((x) => parseInt(x, 10)),
)

function getAdjacent([y, x]: Point) {
  return (
    [
      [y - 1, x - 1],
      [y - 1, x],
      [y - 1, x + 1],
      [y + 1, x - 1],
      [y + 1, x],
      [y + 1, x + 1],
      [y, x + 1],
      [y, x - 1],
    ] as Point[]
  ).filter(
    ([y, x]) => y >= 0 && x >= 0 && y < octos.length && x < octos[0].length,
  )
}

function iterate() {
  let flashCount = 0
  const willFlash: Point[] = []

  for (let y = 0; y < octos.length; y++) {
    for (let x = 0; x < octos[0].length; x++) {
      octos[y][x]++
      if (octos[y][x] > 9) willFlash.push([y, x])
    }
  }

  while (willFlash.length > 0) {
    const flashPoint = willFlash.shift()!
    flashCount++
    getAdjacent(flashPoint).forEach(([y, x]) => {
      octos[y][x]++
      if (octos[y][x] === 10) willFlash.push([y, x])
    })
  }

  for (let y = 0; y < octos.length; y++) {
    for (let x = 0; x < octos[0].length; x++) {
      if (octos[y][x] > 9) octos[y][x] = 0
    }
  }

  return flashCount
}

let totalFlashCount = 0

for (let i = 1; true; i++) {
  const flashCount = iterate()
  totalFlashCount += flashCount

  if (i === 100) {
    console.log("Star 1:", totalFlashCount)
  }

  if (flashCount === octos.length * octos[0].length) {
    console.log("Star 2:", i)
    break
  }
}
