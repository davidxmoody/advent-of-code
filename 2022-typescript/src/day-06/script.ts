import {readFileSync} from "fs"

const input = readFileSync(__dirname + "/input.txt", "utf-8")

function allDifferentChars(str: string) {
  const set = new Set(str.split(""))
  return set.size === str.length
}

function findUniqueSequence(num: number) {
  for (let i = 0; i < input.length - num - 1; i++) {
    if (allDifferentChars(input.substring(i, i + num))) {
      return i + num
    }
  }
}

console.log("Star 1:", findUniqueSequence(4))

console.log("Star 2:", findUniqueSequence(14))
