import readLines from "../helpers/readLines"

type Point = [number, number, number]
type Vector = [number, number, number]

const scanners: Point[][] = []

for (const line of readLines(__dirname + "/input.txt")) {
  if (line.startsWith("--- scanner")) {
    scanners.push([])
  } else if (line) {
    scanners[scanners.length - 1].push(
      line.split(",").map((n) => parseInt(n, 10)) as Point,
    )
  }
}

function getVector(from: Point, to: Point): Vector {
  return [to[0] - from[0], to[1] - from[1], to[2] - from[2]]
}

function vectorEquals(vectorA: Vector, vectorB: Vector) {
  return (
    vectorA[0] === vectorB[0] &&
    vectorA[1] === vectorB[1] &&
    vectorA[2] === vectorB[2]
  )
}

function getInnerVectors(points: Point[]) {
  return points.map((p1) => points.map((p2) => getVector(p1, p2)))
}

// "xyz",
// "xy-z",
// "x-yz",
// "x-y-z",
// "xzy",
// "xz-y",
// "x-zy",
// "x-z-y",

// "yxz",
// "yx-z",
// "y-xz",
// "y-x-z",
// "yzx",
// "yz-x",
// "y-zx",
// "y-z-x",

// "zyx",
// "zy-x",
// "z-yx",
// "z-y-x",
// "zxy",
// "zx-y",
// "z-xy",
// "z-x-y",
//
//
//
// ([x, y, z]) => [x, y, z],
// ([x, y, z]) => [x, z, -y],
// ([x, y, z]) => [x, -y, -z],
// ([x, y, z]) => [x, -z, y],
//
// ([x, y, z]) => [-x, -y, z],
// ([x, y, z]) => [-x, z, y],
// ([x, y, z]) => [-x, y, -z],
// ([x, y, z]) => [-x, -z, -y],
//
// ([x, y, z]) => [y, -x, z],
// ([x, y, z]) => [y, z, x],
// ([x, y, z]) => [y, x, -z],
// ([x, y, z]) => [y, -z, -x],
//
// ([x, y, z]) => [-y, x, z],
// ([x, y, z]) => [-y, z, -x],
// ([x, y, z]) => [-y, -x, -z],
// ([x, y, z]) => [-y, -z, x],
//
// ([x, y, z]) => [z, y, -x],
// ([x, y, z]) => [z, -x, -y],
// ([x, y, z]) => [z, -y, x],
// ([x, y, z]) => [z, x, y],
//
// ([x, y, z]) => [-z, y, x],
// ([x, y, z]) => [-z, x, -y],
// ([x, y, z]) => [-z, -y, -x],
// ([x, y, z]) => [-z, -x, y],

const orientationTransforms: Array<(v: Vector) => Vector> = [
  ([x, y, z]) => [x, y, z],
  ([x, y, z]) => [x, z, -y],
  ([x, y, z]) => [x, -y, -z],
  ([x, y, z]) => [x, -z, y],

  ([x, y, z]) => [-x, -y, z],
  ([x, y, z]) => [-x, z, y],
  ([x, y, z]) => [-x, y, -z],
  ([x, y, z]) => [-x, -z, -y],

  ([x, y, z]) => [y, -x, z],
  ([x, y, z]) => [y, z, x],
  ([x, y, z]) => [y, x, -z],
  ([x, y, z]) => [y, -z, -x],

  ([x, y, z]) => [-y, x, z],
  ([x, y, z]) => [-y, z, -x],
  ([x, y, z]) => [-y, -x, -z],
  ([x, y, z]) => [-y, -z, x],

  ([x, y, z]) => [z, y, -x],
  ([x, y, z]) => [z, -x, -y],
  ([x, y, z]) => [z, -y, x],
  ([x, y, z]) => [z, x, y],

  ([x, y, z]) => [-z, y, x],
  ([x, y, z]) => [-z, x, -y],
  ([x, y, z]) => [-z, -y, -x],
  ([x, y, z]) => [-z, -x, y],
]

function countOverlap(vectorsA: Vector[], vectorsB: Vector[]) {
  let overlaps = 0
  for (const vectorA of vectorsA) {
    for (const vectorB of vectorsB) {
      if (vectorEquals(vectorA, vectorB)) overlaps++
    }
  }
  return overlaps
}

function doScannersOverlap(scannerA: Point[], scannerB: Point[]) {
  for (const innerVectorsA of getInnerVectors(scannerA)) {
    for (const innerVectorsB of getInnerVectors(scannerB)) {
      for (const orientation of orientationTransforms) {
        const transformedInnerVectorsB = innerVectorsB.map(orientation)
        if (countOverlap(innerVectorsA, transformedInnerVectorsB) >= 12) {
          // TODO return transform
          return true
        }
      }
    }
  }
  return false
}

// const finalPoints = new Set(scanners[0].map((p) => p.join(",")))
const transformedScanners = [scanners.shift()!]

while (scanners.length) {
  for (let i = 0; i < scanners.length; i++) {
    for (const ts of transformedScanners) {
      const transform = doScannersOverlap(ts, scanners[i])
      if (transform) {
        transformedScanners.push(
          scanners[i].map((points) => points.map(transform)),
        )
        // TODO splice out old one
      }
    }
  }
}

// for (let i = 0; i < scanners.length; i++) {
//   for (let j = 0; j < scanners.length; j++) {
//     if (i === j) continue

//     if (doScannersOverlap(scanners[i], scanners[j])) {
//       console.log(i, j)
//     }
//   }
// }

// function getDistance(a: Point, b: Point) {
//   return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])
// }

// function countOverlap(sortedA: number[], sortedB: number[]) {
//   let indexA = 0
//   let indexB = 0

//   let overlapCount = 0

//   while (sortedA[indexA] !== undefined && sortedB[indexB] !== undefined) {
//     if (sortedA[indexA] === sortedB[indexB]) overlapCount++
//     if (sortedA[indexA] < sortedB[indexB]) indexA++
//     else indexB++
//   }

//   return overlapCount
// }

// const scannerDistances = scanners.map((points) => {
//   const distances: number[] = []

//   for (let i = 0; i < points.length - 1; i++) {
//     for (let j = i + 1; j < points.length; j++) {
//       distances.push(getDistance(points[i], points[j]))
//     }
//   }

//   distances.sort((a, b) => a - b)

//   return distances
// })

// for (let i = 0; i < scannerDistances.length - 1; i++) {
//   for (let j = i + 1; j < scannerDistances.length; j++) {
//     console.log(countOverlap(scannerDistances[i], scannerDistances[j]))
//   }
// }
