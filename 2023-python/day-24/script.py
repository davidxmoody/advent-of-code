from typing import NamedTuple
from itertools import combinations
from sympy import symbols, nsolve


class Line(NamedTuple):
    x: int
    y: int
    z: int
    dx: int
    dy: int
    dz: int


def parse_line(line: str):
    (before, after) = line[:-1].split(" @ ")
    (x, y, z) = [int(i) for i in before.split(", ")]
    (dx, dy, dz) = [int(i) for i in after.split(", ")]
    return Line(x, y, z, dx, dy, dz)


lines = [parse_line(line) for line in open("day-24/input.txt")]


def get_line_constants(line: Line):
    # y = a*x + b
    a = line.dy / line.dx
    b = line.y - a * line.x
    return (a, b)


def intersection_2d(l1: Line, l2: Line):
    (a1, b1) = get_line_constants(l1)
    (a2, b2) = get_line_constants(l2)

    if a1 == a2:
        return None

    x = (b2 - b1) / (a1 - a2)
    y = a1 * x + b1

    past1 = (l1.x > x and l1.dx > 0) or (l1.x < x and l1.dx < 0)
    past2 = (l2.x > x and l2.dx > 0) or (l2.x < x and l2.dx < 0)

    if past1 or past2:
        return None

    return (x, y)


def in_test_area(p):
    return (
        p is not None
        and 200000000000000 <= p[0] <= 400000000000000
        and 200000000000000 <= p[1] <= 400000000000000
    )


crossings = 0
for l1, l2 in combinations(lines, 2):
    if in_test_area(intersection_2d(l1, l2)):
        crossings += 1

print("Star 1:", crossings)


# For each line (L), form an equation for each dimension (x, y, z) which
# determines the value of time (t) when the rock line (R) crosses it:
# Lx + t*Ldx = Rx + t*Rdx
#
# Then rearrange to put the time on the left:
# t = (Rx - Lx) / (Ldx - Rdx)
#
# This can be done for each dimension with the t value being the same. You end
# up with 3 different equations:
# (Rx - Lx) / (Ldx - Rdx) = (Ry - Ly) / (Ldy - Rdy) = (Rz - Lz) / (Ldz - Rdz)
#
# Then for every line, put those equations into a general purpose solver.

x, y, z, dx, dy, dz = symbols("x,y,z,dx,dy,dz")

line_fns = []
for l in lines:
    line_fns.append(x * l.dy - x * dy - l.x * l.dy + l.x * dy - y * l.dx + y * dx + l.y * l.dx - l.y * dx)
    line_fns.append(x * l.dz - x * dz - l.x * l.dz + l.x * dz - z * l.dx + z * dx + l.z * l.dx - l.z * dx)
    line_fns.append(z * l.dy - z * dy - l.z * l.dy + l.z * dy - y * l.dz + y * dz + l.y * l.dz - l.y * dz)

solution = nsolve(line_fns, (x, y, z, dx, dy, dz), (0, 0, 0, 0, 0, 0))

print("Star 2:", int(solution[0]) + int(solution[1]) + int(solution[2]))
