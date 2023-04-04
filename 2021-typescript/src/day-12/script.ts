import readLines from "../helpers/readLines"

const caves: Record<string, string[]> = {}

readLines(__dirname + "/input.txt").map((line) => {
  const [a, b] = line.split("-")
  caves[a] = [...(caves[a] ?? []), b]
  caves[b] = [...(caves[b] ?? []), a]
})

function isLargeCave(cave: string) {
  return cave === cave.toUpperCase()
}

function* findPaths(
  hasDoubleSmallRemaining: boolean = false,
  current: string = "start",
  visited: string[] = ["start"],
): Generator<string[]> {
  const nextCaves = caves[current].filter(
    (cave) =>
      cave !== "start" &&
      (hasDoubleSmallRemaining || isLargeCave(cave) || !visited.includes(cave)),
  )

  for (const nextCave of nextCaves) {
    if (nextCave === "end") {
      yield [...visited, "end"]
    } else {
      const usedDoubleSmall =
        !isLargeCave(nextCave) && visited.includes(nextCave)

      yield* findPaths(hasDoubleSmallRemaining && !usedDoubleSmall, nextCave, [
        ...visited,
        nextCave,
      ])
    }
  }
}

console.log("Star 1:", [...findPaths()].length)

console.log("Star 2:", [...findPaths(true)].length)
