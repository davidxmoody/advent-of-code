import readLines from "../helpers/readLines"

const instructions = readLines(__dirname + "/input.txt").map((line) => {
  const [word, unparsedNum] = line.split(" ")
  const num = parseInt(unparsedNum, 10)
  return [word, num] as const
})

{
  let depth = 0
  let horizontal = 0

  for (const [word, num] of instructions) {
    if (word === "down") depth += num
    if (word === "up") depth -= num
    if (word === "forward") horizontal += num
  }

  console.log("Star 1:", depth * horizontal)
}

{
  let depth = 0
  let horizontal = 0
  let aim = 0

  for (const [word, num] of instructions) {
    if (word === "down") aim += num
    if (word === "up") aim -= num
    if (word === "forward") {
      horizontal += num
      depth += num * aim
    }
  }

  console.log("Star 2:", depth * horizontal)
}
