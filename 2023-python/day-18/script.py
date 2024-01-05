from bisect import insort


def parse_line(line: str):
    parts = line[:-1].split(" ")
    d1 = parts[0]
    n1 = int(parts[1])
    d2 = ["R", "D", "L", "U"][int(parts[2][-2])]
    n2 = int(parts[2][2:-2], 16)
    return ((d1, n1), (d2, n2))


data = [parse_line(line) for line in open("day-18/input.txt")]


def walk(position: tuple[int, int], direction: str, distance: int):
    (y, x) = position
    if direction == "U":
        return (y - distance, x)
    elif direction == "D":
        return (y + distance, x)
    elif direction == "R":
        return (y, x + distance)
    elif direction == "L":
        return (y, x - distance)
    else:
        raise Exception("Invalid direction")


def build_points(instructions: list[tuple[str, int]]):
    points = []
    pos = (0, 0)
    for d, n in instructions:
        pos = walk(pos, d, n)
        insort(points, pos)
    return points


def get_lines(xs: list[int]):
    return [(xs[i * 2], xs[i * 2 + 1]) for i in range(len(xs) // 2)]


def union_lines(lines1: list[tuple[int, int]], lines2: list[tuple[int, int]]):
    all_lines = sorted(lines1 + lines2)
    union = [all_lines.pop(0)]
    for line in all_lines:
        overlap = union[-1][1] >= line[0]
        if overlap:
            union[-1] = (union[-1][0], max(line[1], union[-1][1]))
        else:
            union.append(line)
    return union


def calc_line_lengths(lines: list[tuple[int, int]]):
    return sum((b - a + 1) for a, b in lines)


def calc_area(points: list[tuple[int, int]]):
    area = 0
    y = points[0][0]
    xs = []

    while len(points):
        new_xs = []
        while len(points) and points[0][0] == y:
            new_xs.append(points.pop(0)[1])

        area += calc_line_lengths(union_lines(get_lines(xs), get_lines(new_xs)))

        for new_x in new_xs:
            if new_x in xs:
                xs.remove(new_x)
            else:
                insort(xs, new_x)

        y += 1

    return area


print("Star 1:", calc_area(build_points([a for (a, _) in data])))

print("Star 2:", calc_area(build_points([b for (_, b) in data])))
