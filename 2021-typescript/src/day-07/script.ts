import readLines from "../helpers/readLines"

const positions = readLines(__dirname + "/input.txt")[0]
  .split(",")
  .map((x) => parseInt(x, 10))

function calculateBestFuelCost(getTripCost: (distance: number) => number) {
  let bestFuel = Infinity

  for (let i = Math.min(...positions); i <= Math.max(...positions); i++) {
    const totalFuel = positions.reduce(
      (acc, position) => acc + getTripCost(Math.abs(position - i)),
      0,
    )

    if (totalFuel < bestFuel) bestFuel = totalFuel
  }

  return bestFuel
}

console.log(
  "Star 1:",
  calculateBestFuelCost((distance) => distance),
)

const triangeNumberCache: Record<number, number> = []

function triangeNumber(num: number): number {
  if (num === 0) return 0

  if (triangeNumberCache[num]) return triangeNumberCache[num]

  const result = num + triangeNumber(num - 1)
  triangeNumberCache[num] = result
  return result
}

console.log("Star 2:", calculateBestFuelCost(triangeNumber))
