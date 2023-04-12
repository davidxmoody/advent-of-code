import readLines from "../helpers/readLines"
import triangleNumber from "../helpers/triangleNumber"

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

console.log("Star 2:", calculateBestFuelCost(triangleNumber))
