import readLines from "../helpers/readLines"

const lines = readLines(__dirname + "/input.txt")

type File = {type: "file"; name: string; size: number}
type Dir = {
  type: "dir"
  name: string
  children?: Array<File | Dir>
  size?: number
}

const currentPath: string[] = []
const root: Dir = {type: "dir", name: "/"}

function followPath(path: string[], dir: Dir): Dir {
  if (path.length === 0) {
    return dir
  }

  const next = dir.children?.find(
    (child) => child.type === "dir" && child.name === path[0],
  )

  if (!next || next.type !== "dir") {
    throw new Error("Invalid path")
  }

  return followPath(path.slice(1), next)
}

for (const line of lines) {
  const cdMatch = /^\$ cd (.*)$/.exec(line)
  if (cdMatch) {
    if (cdMatch[1] === "..") {
      currentPath.pop()
    } else {
      currentPath.push(cdMatch[1])
    }
    continue
  }

  const lsMatch = /^\$ ls$/.exec(line)
  if (lsMatch) {
    // Do nothing
    continue
  }

  const lsItem = /^(dir|\d+) (.*)$/.exec(line)
  if (lsItem) {
    const item: File | Dir =
      lsItem[1] === "dir"
        ? {type: "dir", name: lsItem[2]}
        : {type: "file", name: lsItem[2], size: parseInt(lsItem[1], 10)}

    const currentDir = followPath(currentPath.slice(1), root)
    currentDir.children = [...(currentDir.children ?? []), item]
    continue
  }

  throw new Error("Unexpected input")
}

function iterateOverDirs(dir: Dir, fn: (dir: Dir) => void) {
  for (const child of dir.children ?? []) {
    if (child.type === "dir") {
      iterateOverDirs(child, fn)
    }
  }
  fn(dir)
}

iterateOverDirs(root, (dir) => {
  dir.size = (dir.children ?? []).reduce((acc, child) => acc + child.size!, 0)
})

let sumOfSmallDirSizes = 0
iterateOverDirs(root, (dir) => {
  if (dir.size! <= 100000) {
    sumOfSmallDirSizes += dir.size!
  }
})
console.log("Star 1:", sumOfSmallDirSizes)

const requiredDeletionSize = root.size! - 40000000
let currentDeletionTargetSize = Infinity

iterateOverDirs(root, (dir) => {
  if (
    dir.size! >= requiredDeletionSize &&
    dir.size! < currentDeletionTargetSize
  ) {
    currentDeletionTargetSize = dir.size!
  }
})

console.log("Star 2:", currentDeletionTargetSize)
