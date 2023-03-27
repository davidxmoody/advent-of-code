import data from "./data"

function sum(xStart: number, yStart: number, size: number): number | null {
  let total = 0

  for (let x = xStart; x < xStart + size; x++) {
    for (let y = yStart; y < yStart + size; y++) {
      total += data[y][x]
    }
  }

  return total
}

let largest = -Infinity
let largestX
let largestY
let largestSize

for (let size = 1; size <= 300; size++) {
  const greatestPossible = size * size * 4

  nextSize:
  for (let y = 0; y <= (300 - size); y++) {
    const columnSums = []
    for (let i = 0; i < 300; i++) {
      let columnSum = 0
      for (let j = 0; j < size; j++) {
        columnSum += data[y + j][i]
      }
      columnSums.push(columnSum)
    }

    for (let x = 0; x <= (300 - size); x++) {
      let num = 0
      for (let i = 0; i < size; i++) {
        num += columnSums[x + i]
      }

      if (num != null && num > largest) {
        console.log(
          `Sum: ${num},	x: ${x + 1},	y: ${y + 1},	size: ${size}`,
        )
        largest = num
        largestX = x
        largestY = y
        largestSize = size
      }

      if (num === greatestPossible) {
        // Reached greatest possible for this size
        continue nextSize
      }
    }
  }
}

console.log(`${largestX},${largestY},${largestSize}`)

// Solution: num=91, x=233, y=228, size=12
