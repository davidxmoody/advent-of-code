from numpy import array

data = array([list(line[:-1]) for line in list(open("day-10/input.txt"))])

north = (-1, 0)
south = (1, 0)
west = (0, -1)
east = (0, 1)

pipes = {
    "|": [north, south],
    "-": [east, west],
    "L": [north, east],
    "J": [north, west],
    "7": [south, west],
    "F": [south, east],
    ".": [],
}


def reverse(s: tuple[int, int]):
    return (s[0] * -1, s[1] * -1)


def walk(p: tuple[int, int], s: tuple[int, int]):
    return (p[0] + s[0], p[1] + s[1])


def is_connected(p: tuple[int, int], s: tuple[int, int]):
    p2 = walk(p, s)
    backsteps = pipes[data[p2]]
    return any([s2 == reverse(s) for s2 in backsteps])


start = (0, 0)
for y, line in enumerate(data):
    for x, char in enumerate(line):
        if char == "S":
            start = (y, x)
            for char, steps in pipes.items():
                if all([is_connected(start, step) for step in steps]):
                    data[start] = char
                    break

main_pipe = array([["." for _ in line] for line in data])

current = start
direction = pipes[data[start]][0]
distance = 0

while distance == 0 or current != start:
    main_pipe[current] = data[current]
    current = walk(current, direction)
    direction = [s for s in pipes[data[current]] if reverse(s) != direction][0]
    distance += 1

print("Star 1:", distance // 2)

num_inside = 0
for line in main_pipe:
    is_inside = False
    for x, char in enumerate(line):
        if char in ("|", "J", "L"):
            is_inside = not is_inside
        elif char == "." and is_inside:
            num_inside += 1

print("Star 2:", num_inside)
