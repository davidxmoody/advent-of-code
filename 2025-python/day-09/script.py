from itertools import combinations


red_tiles = [
    tuple(int(part) for part in line.split(","))
    for line in open("day-09/input.txt").read().splitlines()
]


def area(p1, p2):
    return (abs(p1[0] - p2[0]) + 1) * (abs(p1[1] - p2[1]) + 1)


largest_area = max(area(p1, p2) for p1, p2 in combinations(red_tiles, 2))

print(f"Star 1: {largest_area}")


def vector(p1, p2):
    x1, y1 = p1
    x2, y2 = p2
    return (x2 - x1, y2 - y1)


def unit_vector(p1, p2):
    dx, dy = vector(p1, p2)
    return ((dx > 0) - (dx < 0), (dy > 0) - (dy < 0))


def line_intersects_rectangle(rect_p1, rect_p2, a, b):
    (x1, y1), (x2, y2) = rect_p1, rect_p2
    xmin, xmax = sorted((x1, x2))
    ymin, ymax = sorted((y1, y2))

    ax, ay = a
    bx, by = b

    def inside_strict(x, y):
        return xmin < x < xmax and ymin < y < ymax

    if inside_strict(ax, ay) or inside_strict(bx, by):
        return True

    if ax == bx:
        x = ax
        if xmin < x < xmax:
            seg_ymin, seg_ymax = sorted((ay, by))
            return max(seg_ymin, ymin) < min(seg_ymax, ymax)

    else:
        y = ay
        if ymin < y < ymax:
            seg_xmin, seg_xmax = sorted((ax, bx))
            return max(seg_xmin, xmin) < min(seg_xmax, xmax)

    return False


def no_line_crosses_rectangle(rect_p1, rect_p2):
    for i, a in enumerate(red_tiles):
        b = red_tiles[(i + 1) % len(red_tiles)]
        if line_intersects_rectangle(rect_p1, rect_p2, a, b):
            return False
    return True


def turn_direction(v1, v2):
    cross = v1[0] * v2[1] - v1[1] * v2[0]
    return 1 if cross > 0 else -1


turns = {
    tile: (
        unit_vector(red_tiles[(i - 1) % len(red_tiles)], tile),
        unit_vector(tile, red_tiles[(i + 1) % len(red_tiles)]),
    )
    for i, tile in enumerate(red_tiles)
}


clockwise = sum(turn_direction(*turn) for turn in turns.values()) > 0

candidates = {
    "topleft": [],
    "topright": [],
    "bottomleft": [],
    "bottomright": [],
}

for p in red_tiles:
    match turns[p]:
        case ((1, 0), (0, 1)):
            c = ["topright"]
        case ((0, 1), (-1, 0)):
            c = ["bottomright"]
        case ((-1, 0), (0, -1)):
            c = ["bottomleft"]
        case ((0, -1), (1, 0)):
            c = ["topleft"]

        case ((1, 0), (0, -1)):
            c = ["topleft", "topright", "bottomleft"]
        case ((0, 1), (1, 0)):
            c = ["topleft", "topright", "bottomright"]
        case ((-1, 0), (0, 1)):
            c = ["topright", "bottomleft", "bottomright"]
        case ((0, -1), (-1, 0)):
            c = ["topleft", "bottomleft", "bottomright"]

        case _:
            raise Exception("Invalid turn")

    if not clockwise:
        c = list(candidates.keys() - c)

    for cn in c:
        candidates[cn].append(p)


largest_area_with_green = 0

for p1 in candidates["topleft"]:
    for p2 in candidates["bottomright"]:
        if no_line_crosses_rectangle(p1, p2):
            largest_area_with_green = max(largest_area_with_green, area(p1, p2))

for p1 in candidates["topright"]:
    for p2 in candidates["bottomleft"]:
        if no_line_crosses_rectangle(p1, p2):
            largest_area_with_green = max(largest_area_with_green, area(p1, p2))

print(f"Star 2: {largest_area_with_green}")
