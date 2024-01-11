from numpy import argwhere, array
from typing import NamedTuple


class Point(NamedTuple):
    y: int
    x: int


data = array([[c for c in line[:-1]] for line in open("day-21/input.txt")])
rocks = data == "#"
start_point = Point(*argwhere(data == "S")[0])


def is_rock(p: Point):
    return rocks[p.y % len(rocks)][p.x % len(rocks[0])]


def one_step(p: Point):
    for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        p2 = Point(p.y + dy, p.x + dx)
        if not is_rock(p2):
            yield p2


def two_steps(p: Point):
    steps = set()
    for p2 in one_step(p):
        for p3 in one_step(p2):
            steps.add(p3)
    return steps


def traverse(steps: int):
    edge = set([start_point])

    if steps % 2 != 0:
        edge = set(one_step(start_point))
        steps -= 1

    reached_even = edge

    for _ in range(steps, 0, -2):
        next_edge: set[Point] = set()
        for edge_p in edge:
            next_edge |= two_steps(edge_p) - reached_even
        reached_even |= next_edge
        edge = next_edge

    return len(reached_even)


print("Star 1:", traverse(64))

# The number of required steps for star 2 happens to be a multiple of the grid
# size (131) plus half the grid size (65). As the grid size multiplier (n)
# increases, the area increases in a similar way to triangle numbers and so can
# be represented as a quadratic polynomial. By calculating the first 3 numbers
# in the sequence, the constants for that polynomial can be calculated.

# area(n) = an^2 + bn + c
# area(0) = c
# area(1) = a + b + c
# area(2) = 4a + 2b + c

cycle_length = len(data)
half_cycle_length = cycle_length // 2

area0 = traverse(half_cycle_length)
area1 = traverse(1 * cycle_length + half_cycle_length)
area2 = traverse(2 * cycle_length + half_cycle_length)

c = area0
b = (-1 * area2 + 4 * area1 - 3 * area0) // 2
a = area1 - area0 - b

n = (26501365 - half_cycle_length) // cycle_length

print("Star 2:", a * n**2 + b * n + c)
