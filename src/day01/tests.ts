import {getFuel} from "./getFuel"
import assert from "assert"
import data from "./data.json"

describe("getFuel", () => {
  const testCases = [[0, 0], [12, 2], [14, 2], [1969, 654], [100756, 33583]]

  testCases.forEach(([input, output]) => {
    it(`getFuel(${input}) === ${output}`, () => {
      assert(getFuel(input) === output)
    })
  })
})

describe("Star 1", () => {
  const correctAnswer = 3363929
  const totalFuelRequirement = data.map(getFuel).reduce((a, b) => a + b)

  it(`returns ${correctAnswer}`, () => {
    assert(totalFuelRequirement === correctAnswer)
  })
})
