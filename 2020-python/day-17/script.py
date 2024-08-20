from collections import namedtuple, Counter

Point = namedtuple("Point", ["x", "y", "z", "w"])

initial_grid = [[c == "#" for c in line.strip()] for line in open("day-17/input.txt")]

initial_active: set[Point] = {
    Point(x, y, 0, 0)
    for y in range(len(initial_grid))
    for x in range(len(initial_grid[0]))
    if initial_grid[y][x]
}


def adjacent(p: Point, wdim: bool):
    return [
        Point(p.x + dx, p.y + dy, p.z + dz, p.w + dw)
        for dx in (-1, 0, 1)
        for dy in (-1, 0, 1)
        for dz in (-1, 0, 1)
        for dw in ((-1, 0, 1) if wdim else (0,))
        if not (dx == 0 and dy == 0 and dz == 0 and dw == 0)
    ]


def run(wdim: bool):
    active = initial_active

    for _ in range(6):
        adjacent_counts: Counter[Point] = Counter()
        for p in active:
            for a in adjacent(p, wdim):
                adjacent_counts[a] += 1

        next_active: set[Point] = set()
        for p, count in adjacent_counts.items():
            if count == 3 or (count == 2 and p in active):
                next_active.add(p)

        active = next_active

    return len(active)


print(f"Star 1: {run(False)}")

print(f"Star 2: {run(True)}")
