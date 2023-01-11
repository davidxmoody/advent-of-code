import readLines from "../helpers/readLines"

const rangePairs = readLines(__dirname + "/input.txt").map((line) => {
  const match = /^(\d+)-(\d+),(\d+)-(\d+)$/.exec(line)
  if (!match) {
    throw new Error("Could not parse")
  }
  return [
    [parseFloat(match[1]), parseFloat(match[2])],
    [parseFloat(match[3]), parseFloat(match[4])],
  ]
})

const star1Answer = rangePairs.filter(
  ([[start1, end1], [start2, end2]]) =>
    (start1 <= start2 && end1 >= end2) || (start2 <= start1 && end2 >= end1),
).length

console.log("Star 1:", star1Answer)

const star2Answer = rangePairs.filter(
  ([[start1, end1], [start2, end2]]) => !(end1 < start2 || end2 < start1),
).length

console.log("Star 2:", star2Answer)
