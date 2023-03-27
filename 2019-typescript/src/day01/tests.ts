import {getFuel, getFuelRecursive} from "./getFuel"
import assert from "assert"
import data from "./data.json"

describe("Day 1", () => {
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

  describe("getFuelRecursive", () => {
    const testCases = [[0, 0], [14, 2], [1969, 966], [100756, 50346]]

    testCases.forEach(([input, output]) => {
      it(`getFuelRecursive(${input}) === ${output}`, () => {
        assert(getFuelRecursive(input) === output)
      })
    })
  })

  describe("Star 2", () => {
    const correctAnswer = 5043026
    const totalFuelRequirement = data
      .map(getFuelRecursive)
      .reduce((a, b) => a + b)

    it(`returns ${correctAnswer}`, () => {
      assert(totalFuelRequirement === correctAnswer)
    })
  })
})
