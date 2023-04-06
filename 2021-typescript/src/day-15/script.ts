import {PriorityQueue} from "../helpers/priorityQueue"
import readLines from "../helpers/readLines"
import {World} from "../helpers/world"

interface State {
  y: number
  x: number
  risk: number
}

const smallWorld = new World(
  readLines(__dirname + "/input.txt").map((line) =>
    line.split("").map((x) => parseInt(x, 10)),
  ),
)

function findRoute(world: World<number>) {
  const queue = new PriorityQueue<State>(
    (state) => `${state.y},${state.x}`,
    (state) => state.risk,
    [{y: 0, x: 0, risk: 0}],
  )

  const visited = World.fill(world, false)
  visited.set({x: 0, y: 0}, true)

  while (queue.length) {
    const state = queue.shift()!
    visited.set(state, true)

    if (state.y === world.height - 1 && state.x === world.width - 1) {
      return state.risk
    }

    const adjacent = world.getAdjacent(state)
    const nextStates = adjacent
      .filter((point) => !visited.get(point))
      .map(({x, y}) => ({
        x,
        y,
        risk: state.risk + world.get({x, y}),
      }))
    queue.add(nextStates)
  }
}

const largeWorld = World.fill(
  {width: smallWorld.width * 5, height: smallWorld.height * 5},
  NaN,
)

for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    smallWorld.forEachCell(({x, y}, value) => {
      largeWorld.set(
        {x: x + i * smallWorld.width, y: y + j * smallWorld.height},
        value + i + j > 9 ? value + i + j - 9 : value + i + j,
      )
    })
  }
}

console.log("Star 1:", findRoute(smallWorld))

console.log("Star 2:", findRoute(largeWorld))
