program = [(s[:3], int(s[4:-1])) for s in open("day-08/input.txt")]


def run(swap_index: int | None = None):
    acc = 0
    index = 0
    visited = set[int]()

    while index not in visited and 0 <= index < len(program):
        visited.add(index)
        instruction, value = program[index]

        if index == swap_index:
            instruction = {"nop": "jmp", "jmp": "nop", "acc": "acc"}[instruction]

        match instruction:
            case "nop":
                index += 1
            case "acc":
                acc += value
                index += 1
            case "jmp":
                index += value

    terminated = index == len(program)
    return (acc, terminated)


print(f"Star 1: {run()[0]}")

for i in range(len(program)):
    acc, terminated = run(i)
    if terminated:
        print(f"Star 2: {acc}")
        break
