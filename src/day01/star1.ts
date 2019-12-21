import data from "./data.json"
import {getFuel} from "./getFuel"

const totalFuelRequirement = data.map(getFuel).reduce((a, b) => a + b)

console.log(totalFuelRequirement)
