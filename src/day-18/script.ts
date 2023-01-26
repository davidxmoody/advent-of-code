import readLines from "../helpers/readLines"

// x, y, z
type Position = [number, number, number]
type World = boolean[][][]

type FaceDirection =
  | [1, 0, 0]
  | [-1, 0, 0]
  | [0, 1, 0]
  | [0, -1, 0]
  | [0, 0, 1]
  | [0, 0, -1]
type Face = [Position, FaceDirection]

const world: World = []

function fill([x, y, z]: Position) {
  world[x] = world[x] ?? []
  world[x][y] = world[x][y] ?? []
  world[x][y][z] = true
}

function isFilled([x, y, z]: Position) {
  return !!world[x]?.[y]?.[z]
}

const cubes = readLines(__dirname + "/input.txt").map(
  (line) => line.split(",").map((x) => parseInt(x, 10)) as Position,
)

cubes.forEach(fill)

function getAdjacentPositions([x, y, z]: Position): Position[] {
  return [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
  ]
}

const totalExposedSides = cubes
  .flatMap((p) => getAdjacentPositions(p).map((p) => !isFilled(p)))
  .filter((x) => x).length

console.log("Star 1:", totalExposedSides)

function step(from: Position, to: Position): Position {
  return [to[0] - from[0], to[1] - from[1], to[2] - from[2]]
}

function getAdjacentFaces(face: Face): Face[] {
  const [[x, y, z], [fx, fy, fz]] = face

  // If provided face is valid then space opposite must be empty
  const empty: Position = [x + fx, y + fy, z + fz]
  const [ex, ey, ez] = empty

  // Take one step in every direction except parallel to the face
  const diagonalAdjacents = [
    fx === 0 ? [ex + 1, ey, ez] : null,
    fx === 0 ? [ex - 1, ey, ez] : null,
    fy === 0 ? [ex, ey + 1, ez] : null,
    fy === 0 ? [ex, ey - 1, ez] : null,
    fz === 0 ? [ex, ey, ez + 1] : null,
    fz === 0 ? [ex, ey, ez - 1] : null,
  ].filter((x) => x) as Position[]

  return diagonalAdjacents.map((diag) => {
    // If diagonal space is filled, return a concave face
    if (isFilled(diag)) {
      return [diag, step(diag, empty)] as Face
    }

    // If not but orthogonal space is filled, return a flat face
    const orthog: Position = [diag[0] - fx, diag[1] - fy, diag[2] - fz]
    if (isFilled(orthog)) {
      return [orthog, step(orthog, diag)] as Face
    }

    // Otherwise return a convex face
    return [face[0], step(face[0], orthog)] as Face
  })
}

function stringifyFace(face: Face) {
  return face.map((c) => c.join(",")).join("F")
}

function parseFace(stringFace: string) {
  return stringFace
    .split("F")
    .map((c) => c.split(",").map((i) => parseInt(i, 10))) as Face
}

// Leftmost cube face is guaranteed to be on the outside
const leftmostCube = cubes.sort(([ax], [bx]) => ax - bx)[0]
const leftmostFace: Face = [leftmostCube, [-1, 0, 0]]

const nextFaces = new Set([stringifyFace(leftmostFace)])
const exploredFaces = new Set<string>()
let currentStringFace: string | undefined = undefined

while ((currentStringFace = nextFaces.values().next().value)) {
  nextFaces.delete(currentStringFace)
  exploredFaces.add(currentStringFace)

  getAdjacentFaces(parseFace(currentStringFace))
    .map(stringifyFace)
    .filter((sf) => !nextFaces.has(sf) && !exploredFaces.has(sf))
    .forEach((sf) => nextFaces.add(sf))
}

console.log("Star 2:", exploredFaces.size)
