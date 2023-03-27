import {readFileSync} from "node:fs"

export default function readLines(file: string) {
  return readFileSync(file, "utf-8").trimEnd().split("\n")
}
