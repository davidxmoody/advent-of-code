import readLines from "../helpers/readLines"

const lines = readLines(__dirname + "/input.txt")

const rules: Record<string, string> = {}

for (const line of lines) {
  const match = /^([A-Z][A-Z]) -> ([A-Z])$/.exec(line)
  if (match) rules[match[1]] = match[2]
}

const initialPoly = lines[0]

let polyPairs: Record<string, number> = {}

for (let i = 1; i < initialPoly.length; i++) {
  const pair = initialPoly[i - 1] + initialPoly[i]
  polyPairs[pair] = (polyPairs[pair] ?? 0) + 1
}

function iterate() {
  const newPolyPairs: Record<string, number> = {}

  for (const [pair, count] of Object.entries(polyPairs)) {
    const newPair1 = pair[0] + rules[pair]
    const newPair2 = rules[pair] + pair[1]

    newPolyPairs[newPair1] = (newPolyPairs[newPair1] ?? 0) + count
    newPolyPairs[newPair2] = (newPolyPairs[newPair2] ?? 0) + count
  }

  polyPairs = newPolyPairs
}

function getFrequencyDiff() {
  // Each pair double-counts each letter except for the very first and last letters

  const letterCounts: Record<string, number> = {}
  for (const [pair, count] of Object.entries(polyPairs)) {
    letterCounts[pair[0]] = (letterCounts[pair[0]] ?? 0) + count / 2
    letterCounts[pair[1]] = (letterCounts[pair[1]] ?? 0) + count / 2
  }

  letterCounts[initialPoly[0]] += 0.5
  letterCounts[initialPoly[initialPoly.length - 1]] += 0.5

  const sortedCounts = Object.values(letterCounts).sort((a, b) => a - b)
  return sortedCounts[sortedCounts.length - 1] - sortedCounts[0]
}

for (let i = 0; i < 10; i++) {
  iterate()
}

console.log("Star 1:", getFrequencyDiff())

for (let i = 0; i < 30; i++) {
  iterate()
}

console.log("Star 1:", getFrequencyDiff())
