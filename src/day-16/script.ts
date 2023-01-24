import {indexBy} from "ramda"
import readLines from "../helpers/readLines"

const rooms = readLines(__dirname + "/input.txt").map((line) => {
  const match = line.match(
    /^Valve ([A-Z][A-Z]) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)$/,
  )
  if (!match) throw new Error("Could not parse")
  return {
    id: match[1],
    flow: parseInt(match[2], 10),
    exits: match[3].split(", "),
  }
})

function isNodeRoom(room: typeof rooms[number]) {
  return !(room.flow === 0 && room.exits.length === 2)
}

function findNextNodeRoom(
  roomId: string,
  fromRoomId: string,
  distance: number = 1,
): {id: string; distance: number} {
  const room = rooms.find((room) => room.id === roomId)!
  if (isNodeRoom(room)) return {id: room.id, distance: distance}
  const exitId = room.exits.find((exitId) => exitId !== fromRoomId)!
  return findNextNodeRoom(exitId, room.id, distance + 1)
}

const simplifiedRooms = indexBy(
  (x) => x.id,
  rooms.filter(isNodeRoom).map((room) => ({
    id: room.id,
    flow: room.flow,
    exits: room.exits.map((exit) => findNextNodeRoom(exit, room.id)),
  })),
)

function findBestRoute(
  totalTime: number,
  alreadyVisitedPositions: string[] = [],
) {
  let maxReleased = -Infinity
  let bestVisitedPositions: string[] = []

  function explore(
    position: string,
    visitedPositions: string[],
    openValves: Record<string, boolean>,
    totalReleased: number,
    remainingTime: number,
  ) {
    if (remainingTime <= 0) {
      if (totalReleased > maxReleased) {
        maxReleased = totalReleased
        bestVisitedPositions = visitedPositions
      }
      return
    }

    const incrementalRelease = Object.keys(openValves)
      .map((valve) => simplifiedRooms[valve].flow)
      .reduce((a, b) => a + b, 0)

    if (!openValves[position] && simplifiedRooms[position].flow > 0) {
      explore(
        position,
        visitedPositions,
        {...openValves, [position]: true},
        totalReleased + incrementalRelease,
        remainingTime - 1,
      )
    }

    for (const exit of simplifiedRooms[position].exits) {
      if (
        !visitedPositions.includes(exit.id) &&
        remainingTime > exit.distance
      ) {
        explore(
          exit.id,
          [...visitedPositions, position],
          openValves,
          totalReleased + incrementalRelease * exit.distance,
          remainingTime - exit.distance,
        )
      }
    }

    explore(
      position,
      visitedPositions,
      openValves,
      totalReleased + incrementalRelease * remainingTime,
      0,
    )
  }

  explore("AA", alreadyVisitedPositions, {}, 0, totalTime)

  return {released: maxReleased, visitedPositions: bestVisitedPositions}
}

const soloRoute = findBestRoute(30)

console.log("Star 1:", soloRoute.released)

const partnerRoute1 = findBestRoute(26)
const partnerRoute2 = findBestRoute(26, partnerRoute1.visitedPositions)

console.log("Star 2:", partnerRoute1.released + partnerRoute2.released)
