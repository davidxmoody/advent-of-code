import {PriorityQueue} from "../helpers/priorityQueue"
import readLines from "../helpers/readLines"

type Position = [number, number]

interface State {
  position: Position
  time: number
}

const borderedWorld = readLines(__dirname + "/input.txt").map((line) =>
  line.split(""),
)

const world = borderedWorld
  .slice(1, borderedWorld.length - 1)
  .map((row) => row.slice(1, row.length - 1))

const startPosition: Position = [-1, borderedWorld[0].indexOf(".") - 1]
const endPosition: Position = [
  borderedWorld.length - 2,
  borderedWorld[borderedWorld.length - 1].indexOf(".") - 1,
]

function equal([y1, x1]: Position, [y2, x2]: Position) {
  return y1 === y2 && x1 === x2
}

function wrap(value: number, worldSize: number) {
  if (value >= 0) return value % worldSize
  const invertedWrappedValue = (-1 * (value + 1)) % worldSize
  return worldSize - 1 - invertedWrappedValue
}

function isSafe({position: [y, x], time}: State) {
  if (equal([y, x], startPosition)) return true
  if (equal([y, x], endPosition)) return true
  if (y < 0 || y >= world.length || x < 0 || x >= world[0].length) return false

  return (
    world[wrap(y + time, world.length)][x] !== "^" &&
    world[wrap(y - time, world.length)][x] !== "v" &&
    world[y][wrap(x + time, world[0].length)] !== "<" &&
    world[y][wrap(x - time, world[0].length)] !== ">"
  )
}

function getNextStates({position: [y, x], time}: State): State[] {
  const candidateNextStates: State[] = [
    {position: [y + 1, x], time: time + 1},
    {position: [y, x + 1], time: time + 1},
    {position: [y, x], time: time + 1},
    {position: [y - 1, x], time: time + 1},
    {position: [y, x - 1], time: time + 1},
  ]
  return candidateNextStates.filter(isSafe)
}

function getDistance([y1, x1]: Position, [y2, x2]: Position) {
  return Math.abs(y1 - y2) + Math.abs(x1 - x2)
}

function findBestRoute(initialState: State, destination: Position): State {
  const states = new PriorityQueue<State>(
    (s) => `${s.position[0]},${s.position[1]},${s.time}`,
    (s) => s.time + getDistance(s.position, destination),
    [initialState],
  )

  let state: State | undefined
  while ((state = states.shift())) {
    if (equal(state.position, destination)) return state
    states.add(getNextStates(state))
  }

  throw new Error("Could not find a route")
}

const firstTripEndState = findBestRoute(
  {position: startPosition, time: 0},
  endPosition,
)

console.log("Star 1:", firstTripEndState.time)

const secondTripEndState = findBestRoute(firstTripEndState, startPosition)
const thirdTripEndState = findBestRoute(secondTripEndState, endPosition)

console.log("Star 2:", thirdTripEndState.time)
