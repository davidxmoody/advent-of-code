import {getFuel} from "./getFuel"
import assert from "assert"

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
