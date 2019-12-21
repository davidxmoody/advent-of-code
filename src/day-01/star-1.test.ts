import {getFuel} from "./star-1"
import assert from "assert"

import data from "./data.json"

const testCases = [
  [0, 0],
  [12, 2],
  [14, 2],
  [1969, 654],
  [100756, 33583],
]

testCases.forEach(([input, output]) => {
  it(`getFuel(${input}) === ${output}`, () => {
    assert(getFuel(input) === output)
  })
})

it("calculates the sum of the fuel requirements", () => {
  console.log(data.map(getFuel).reduce((a, b) => a + b))
})
