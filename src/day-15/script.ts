import readLines from "../helpers/readLines"

type Point = {x: number; y: number}

function getDistance(point1: Point, point2: Point) {
  return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y)
}

const data = readLines(__dirname + "/input.txt").map((line) => {
  const match = line.match(
    /^Sensor at x=([0-9-]+), y=([0-9-]+): closest beacon is at x=([0-9-]+), y=([0-9-]+)$/,
  )

  if (!match) throw new Error("Could not parse")

  const sensor = {x: parseInt(match[1], 10), y: parseInt(match[2], 10)}
  const beacon = {x: parseInt(match[3], 10), y: parseInt(match[4], 10)}
  const distance = getDistance(sensor, beacon)

  return {sensor, beacon, distance}
})

function containsBeacon(point: Point) {
  return data.some(({beacon}) => beacon.y === point.y && beacon.x === point.x)
}

function isCloserToAnotherBeacon(point: Point) {
  return data.some(
    ({sensor, distance}) => getDistance(sensor, point) <= distance,
  )
}

function countSpacesWithoutBeacons(y: number) {
  let beaconNotPresentCount = 0
  for (let x = -10000000; x <= 10000000; x++) {
    if (!containsBeacon({x, y}) && isCloserToAnotherBeacon({x, y})) {
      beaconNotPresentCount++
    }
  }
  return beaconNotPresentCount
}

console.log("Star 1:", countSpacesWithoutBeacons(2000000))

function getTuningFreq(point: Point) {
  return 4000000 * point.x + point.y
}

function parseTuningFreq(tuningFreq: number): Point {
  return {x: Math.floor(tuningFreq / 4000000), y: tuningFreq % 4000000}
}

function inRange(point: Point) {
  return (
    point.x >= 0 && point.x <= 4000000 && point.y >= 0 && point.y <= 4000000
  )
}

// Given that there is *exactly one* point in range that is not closer to
// another sensor, that point must lie exactly one step outside of the boundary
// of the diamond drawn by at least four other sensors.

function getTuningFreqsJustOutsideBoundary(center: Point, distance: number) {
  let points: Point[] = []

  for (let y = center.y - distance - 1; y <= center.y + distance + 1; y++) {
    const stepsToSide = Math.abs(distance + 1 - Math.abs(center.y - y))
    if (stepsToSide === 0) {
      points.push({y, x: center.x})
    } else {
      points.push(
        {y, x: center.x - stepsToSide},
        {y, x: center.x + stepsToSide},
      )
    }
  }

  return points.filter(inRange).map(getTuningFreq)
}

const allBoundaryTuningFreqs = data.flatMap(({sensor, distance}) =>
  getTuningFreqsJustOutsideBoundary(sensor, distance),
)

function findItemsWithAtLeastFourOccurrences(list: number[]) {
  list.sort((a, b) => a - b)
  const results = []
  for (let i = 3; i < list.length; i++) {
    if (list[i] === list[i - 3]) {
      results.push(list[i])
    }
  }
  return results
}

const candidatePoints = findItemsWithAtLeastFourOccurrences(
  allBoundaryTuningFreqs,
).map(parseTuningFreq)

const distressBeaconPosition = candidatePoints.find(
  (point) => !isCloserToAnotherBeacon(point),
)!

console.log("Star 2:", getTuningFreq(distressBeaconPosition))
