import {readFileSync} from "fs"

// Note: This finds the correct answer but is very hacky code. I noticed that
// the per-round inspection counts repeat in cycles of 6 rounds after the first
// approx 40 rounds have passed. I never figured out *why* this happens but
// just ended up simulating until the cycle pattern starts happening and then
// hackily cache and re-use the counts from previous rounds from then on. The
// code is very unreadable but I'm too lazy to go back and improve it now.

interface Monkey {
  index: number
  startingItems: bigint[]
  operation: (old: bigint) => bigint
  test: (value: bigint) => number
}

const monkeyRegex = new RegExp(
  `Monkey (?<index>\\d+):
  Starting items: (?<startingItems>[\\d+, ]+)
  Operation: new = (?<operation>.*)
  Test: divisible by (?<divisibleBy>\\d+)
    If true: throw to monkey (?<ifTrue>\\d+)
    If false: throw to monkey (?<ifFalse>\\d+)`,
  "g",
)

const monkeys: Monkey[] = [
  ...readFileSync(__dirname + "/input.txt", "utf-8").matchAll(monkeyRegex),
].map((match) => {
  if (!match.groups) throw new Error("Invalid match")

  const index = parseInt(match.groups.index, 10)

  const startingItems = match.groups.startingItems
    .split(", ")
    .map((x) => BigInt(parseInt(x, 10)))

  const operationExpression = match.groups.operation
  function operation(old: bigint) {
    if (operationExpression === "old * old") {
      return old * old
    }

    const match = operationExpression.match(/^old ([*+]) (\d+)$/)
    if (match && match[1] === "+") {
      return old + BigInt(match[2])
    }

    if (match && match[1] === "*") {
      return old * BigInt(match[2])
    }

    throw new Error("Unexpected expression")
  }

  const divisibleBy = BigInt(parseInt(match.groups.divisibleBy, 10))
  const ifTrue = parseInt(match.groups.ifTrue, 10)
  const ifFalse = parseInt(match.groups.ifFalse, 10)
  function test(value: bigint) {
    return value % divisibleBy === 0n ? ifTrue : ifFalse
  }

  return {index, startingItems, operation, test}
})

function simulate(worryLevelDivisor: bigint, numRounds: number) {
  const totalInspectionCounts = monkeys.map(() => 0)

  const shortcuts: Record<
    string,
    {inspectionCounts: number[]; itemCounts: number[]}
  > = {}

  let shortcutHits = 0

  let currentItems: bigint[][] | null = monkeys.map((m) => [...m.startingItems])
  let currentItemCounts = currentItems!.map((x) => x.length)

  for (let ri = 0; ri < numRounds; ri++) {
    const shortcutKey = JSON.stringify(currentItemCounts)
    const shortcut = shortcuts[shortcutKey]
    if (shortcut) {
      shortcutHits++

      if (shortcutHits >= 6) {
        for (let i = 0; i < shortcut.inspectionCounts.length; i++) {
          totalInspectionCounts[i] += shortcut.inspectionCounts[i]
        }
        currentItemCounts = shortcut.itemCounts
        currentItems = null
        continue
      }
    }

    if (!currentItems) {
      throw new Error("Oh no")
    }

    const roundInspectionCounts = monkeys.map(() => 0)

    for (let mi = 0; mi < monkeys.length; mi++) {
      while (currentItems[mi].length > 0) {
        let item = currentItems[mi].shift()!
        item = monkeys[mi].operation(item)
        item = item / worryLevelDivisor
        const throwToMonkeyIndex = monkeys[mi].test(item)
        currentItems[throwToMonkeyIndex].push(item)
        roundInspectionCounts[mi]++
      }
    }

    for (let i = 0; i < roundInspectionCounts.length; i++) {
      totalInspectionCounts[i] += roundInspectionCounts[i]
    }
    currentItemCounts = currentItems.map((x) => x.length)
    shortcuts[shortcutKey] = {
      itemCounts: currentItemCounts,
      inspectionCounts: roundInspectionCounts,
    }
  }

  const [mostInspections, secondMostInspections] = totalInspectionCounts.sort(
    (a, b) => b - a,
  )

  return mostInspections * secondMostInspections
}

console.log("Star 1:", simulate(3n, 20))

console.log("Star 2:", simulate(1n, 10000))
