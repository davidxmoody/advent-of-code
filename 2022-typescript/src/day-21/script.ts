import readLines from "../helpers/readLines"

type Operation = "+" | "-" | "*" | "/"

type Expression = number | string | [Expression, Operation, Expression]

const monkeys = Object.fromEntries(
  readLines(__dirname + "/input.txt").map((line): [string, Expression] => {
    const numMatch = line.match(/^([a-z]{4}): (\d+)$/)
    if (numMatch) {
      return [numMatch[1], parseInt(numMatch[2], 10)]
    }

    const opMatch = line.match(/^([a-z]{4}): ([a-z]{4}) ([+/*-]) ([a-z]{4})$/)
    if (opMatch) {
      return [opMatch[1], [opMatch[2], opMatch[3] as Operation, opMatch[4]]]
    }

    throw new Error("Could not parse")
  }),
)

function simplify(expression: Expression): Expression {
  if (typeof expression === "number") {
    return expression
  }

  if (typeof expression === "string") {
    if (monkeys[expression]) {
      return simplify(monkeys[expression])
    } else {
      return expression
    }
  }

  const lhs = simplify(expression[0])
  const op = expression[1]
  const rhs = simplify(expression[2])

  if (typeof lhs === "number" && typeof rhs === "number") {
    switch (op) {
      case "+":
        return lhs + rhs
      case "-":
        return lhs - rhs
      case "*":
        return lhs * rhs
      case "/":
        return lhs / rhs
    }
  }

  return [lhs, op, rhs]
}

console.log("Star 1:", simplify("root"))

function findHumnValue(expression: Expression, value: number): number {
  if (expression === "humn") return value

  const [lhs, op, rhs] = expression as [Expression, Operation, Expression]

  if (typeof lhs === "number") {
    switch (op) {
      case "+":
        return findHumnValue(rhs, value - lhs)
      case "-":
        return findHumnValue(rhs, lhs - value)
      case "*":
        return findHumnValue(rhs, value / lhs)
      case "/":
        return findHumnValue(rhs, lhs / value)
    }
  } else if (typeof rhs === "number") {
    switch (op) {
      case "+":
        return findHumnValue(lhs, value - rhs)
      case "-":
        return findHumnValue(lhs, value + rhs)
      case "*":
        return findHumnValue(lhs, value / rhs)
      case "/":
        return findHumnValue(lhs, value * rhs)
    }
  }

  throw new Error("Should not reach here")
}

delete monkeys.humn

const root = monkeys.root as [Expression, Operation, Expression]

const side1 = simplify(root[0])
const side2 = simplify(root[2])

const [expression, value] =
  typeof side1 === "number" ? [side2, side1] : [side1, side2]

console.log("Star 2:", findHumnValue(expression, value as number))
