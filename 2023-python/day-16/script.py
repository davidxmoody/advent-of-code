from numpy import array

mirrors = array([list(line[:-1]) for line in open("day-16/input.txt")])

n = 0
s = 1
e = 2
w = 3

splits = {
    ".": [[n], [s], [e], [w]],
    "/": [[e], [w], [n], [s]],
    "\\": [[w], [e], [s], [n]],
    "-": [[e, w], [e, w], [e], [w]],
    "|": [[n], [s], [n, s], [n, s]],
}


def step(beam: tuple[int, int, int]):
    (y, x, d) = beam

    if d == n:
        y -= 1
    elif d == s:
        y += 1
    elif d == e:
        x += 1
    elif d == w:
        x -= 1

    out_of_bounds = y < 0 or y >= len(mirrors) or x < 0 or x >= len(mirrors[0])

    return None if out_of_bounds else (y, x, d)


def split_beam(beam: tuple[int, int, int]):
    (y, x, d) = beam
    mirror = mirrors[y, x]
    new_dirs = splits[mirror][d]
    return [b for b in (step((y, x, d2)) for d2 in new_dirs) if b]


def count_energized(beam: tuple[int, int, int]):
    beams = array([[[False] * 4 for _ in line] for line in mirrors])

    next_beams = [beam]

    while len(next_beams):
        next_beam = next_beams.pop()
        if not beams[next_beam]:
            beams[next_beam] = True
            next_beams += split_beam(next_beam)

    energized = array([[cell.any() for cell in row] for row in beams])
    return energized.sum()


print("Star 1:", count_energized((0, 0, e)))

edge_beams = [(0, x, s) for x in range(len(mirrors[0]))]
edge_beams += [(len(mirrors) - 1, x, n) for x in range(len(mirrors[0]))]
edge_beams += [(y, 0, e) for y in range(len(mirrors))]
edge_beams += [(y, len(mirrors[0]) - 1, w) for y in range(len(mirrors))]

print("Star 2:", max((count_energized(b) for b in edge_beams)))
