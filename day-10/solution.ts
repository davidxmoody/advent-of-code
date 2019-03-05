import data from "./data"

function sum(xStart: number, yStart: number, size: number): number | null {
  if (xStart + size - 1 >= 300) return null
  if (yStart + size - 1 >= 300) return null

  let total = 0

  for (let x = xStart; x < xStart + size; x++) {
    for (let y = yStart; y < yStart + size; y++) {
      total += data[y][x]
    }
  }

  return total
}

let largest = -Infinity

for (let size = 1; size <= 300; size++) {
  const greatestPossible = size * size * 4
  foo:
  for (let x = 0; x < 300; x++) {
    for (let y = 0; y < 300; y++) {
      const num = sum(x, y, size)
      if (num != null && num > largest) {
        console.log(`Old: ${largest},	new: ${num},	x: ${x+1},	y: ${y+1},	size: ${size}`)
        largest = num
      }
      if (num === greatestPossible) {
        console.log(`Reached greatest possible: x=${x+1}, y=${y+1}, size=${size+1}`)
        continue foo
      }
    }
  }
}

// Solution: num=91, x=233, y=228, size=12
