import {equals, splitEvery} from "ramda"
import readLines from "../helpers/readLines"

type Order = "correct" | "incorrect" | "same"
type Item = number | Item[]

const pairs: Array<Item[]> = splitEvery(2)(
  readLines(__dirname + "/input.txt")
    .filter((x) => x)
    .map((line) => JSON.parse(line)),
)

function compare(left: Item, right: Item): Order {
  if (typeof left === "number" && typeof right === "number") {
    if (left < right) return "correct"
    if (left > right) return "incorrect"
    return "same"
  }

  if (typeof left === "number") {
    return compare([left], right)
  }

  if (typeof right === "number") {
    return compare(left, [right])
  }

  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    if (left[i] === undefined) return "correct"
    if (right[i] === undefined) return "incorrect"
    const result = compare(left[i], right[i])
    if (result === "correct" || result === "incorrect") return result
  }

  return "same"
}

const star1Answer = pairs
  .map((pair, i) => (compare(pair[0], pair[1]) === "correct" ? i + 1 : 0))
  .reduce((a, b) => a + b, 0)

console.log("Star 1:", star1Answer)

const allPackets = [[[2]], [[6]], ...pairs.flat()]

const sortedPackets = allPackets.sort(
  (a, b) => ({correct: -1, same: 0, incorrect: 1}[compare(a, b)]),
)

const star2Answer = sortedPackets
  .map((packet, i) =>
    equals(packet, [[2]]) || equals(packet, [[6]]) ? i + 1 : 1,
  )
  .reduce((a, b) => a * b, 1)

console.log("Star 2:", star2Answer)
