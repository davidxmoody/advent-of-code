import readLines from "../helpers/readLines"

type ArrayOfFour<T> = [T, T, T, T]

interface Blueprint {
  id: number
  robotCosts: ArrayOfFour<ArrayOfFour<number>>
}

const blueprints: Blueprint[] = readLines(__dirname + "/input.txt").map(
  (line) => {
    const match = line.match(
      /^Blueprint (\d+): Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay\. Each geode robot costs (\d+) ore and (\d+) obsidian\.$/,
    )

    if (!match) throw new Error("Could not parse")

    const ints = match.slice(1, 8).map((x) => parseInt(x, 10))

    return {
      id: ints[0],
      robotCosts: [
        [ints[1], 0, 0, 0],
        [ints[2], 0, 0, 0],
        [ints[3], ints[4], 0, 0],
        [ints[5], 0, ints[6], 0],
      ],
    }
  },
)

function getTimeUntilCanAfford(
  costs: ArrayOfFour<number>,
  resources: ArrayOfFour<number>,
  robots: ArrayOfFour<number>,
) {
  let maxWaitingTime = 0

  for (let i = 0; i < 4; i++) {
    const deficit = Math.max(0, costs[i] - resources[i])

    if (deficit === 0) continue

    if (robots[i] === 0) return Infinity

    const waitingTime = Math.ceil(deficit / robots[i])
    maxWaitingTime = Math.max(maxWaitingTime, waitingTime)
  }

  return maxWaitingTime
}

function getBestGeodeCount(blueprint: Blueprint, timeAvailable: number) {
  let maxGeodes = 0

  function simulate(
    time: number,
    resources: ArrayOfFour<number>,
    robots: ArrayOfFour<number>,
  ) {
    if (time === timeAvailable) {
      maxGeodes = Math.max(maxGeodes, resources[3])
      return
    }

    let anyRobotBuilt = false

    for (let nextRobotIndex = 3; nextRobotIndex >= 0; nextRobotIndex--) {
      const costs = blueprint.robotCosts[nextRobotIndex]

      const extraWaitingTime = getTimeUntilCanAfford(costs, resources, robots)

      if (time + extraWaitingTime + 1 < timeAvailable) {
        anyRobotBuilt = true
        simulate(
          time + extraWaitingTime + 1,
          [
            resources[0] + robots[0] * (extraWaitingTime + 1) - costs[0],
            resources[1] + robots[1] * (extraWaitingTime + 1) - costs[1],
            resources[2] + robots[2] * (extraWaitingTime + 1) - costs[2],
            resources[3] + robots[3] * (extraWaitingTime + 1) - costs[3],
          ],
          [
            robots[0] + (nextRobotIndex === 0 ? 1 : 0),
            robots[1] + (nextRobotIndex === 1 ? 1 : 0),
            robots[2] + (nextRobotIndex === 2 ? 1 : 0),
            robots[3] + (nextRobotIndex === 3 ? 1 : 0),
          ],
        )

        // Immediately building a geode or obsidian robot is always best
        if (
          (nextRobotIndex === 3 || nextRobotIndex === 2) &&
          extraWaitingTime === 0
        )
          break
      }
    }

    if (!anyRobotBuilt) {
      simulate(
        timeAvailable,
        [
          resources[0] + robots[0] * (timeAvailable - time),
          resources[1] + robots[1] * (timeAvailable - time),
          resources[2] + robots[2] * (timeAvailable - time),
          resources[3] + robots[3] * (timeAvailable - time),
        ],
        robots,
      )
    }
  }

  simulate(0, [0, 0, 0, 0], [1, 0, 0, 0])

  return maxGeodes
}

const star1Answer = blueprints
  .map((blueprint, index) => getBestGeodeCount(blueprint, 24) * (index + 1))
  .reduce((a, b) => a + b, 0)

console.log("Star 1:", star1Answer)

const star2Answer = blueprints
  .slice(0, 3)
  .map((blueprint) => getBestGeodeCount(blueprint, 32))
  .reduce((a, b) => a * b)

console.log("Star 2:", star2Answer)
