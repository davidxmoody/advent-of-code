data = [[c == "@" for c in line.strip()] for line in open("day-04/input.txt")]


def count_adjacent(y: int, x: int):
    total = 0

    adjacent_positions = [
        (y - 1, x - 1),
        (y - 1, x),
        (y - 1, x + 1),
        (y, x - 1),
        (y, x + 1),
        (y + 1, x - 1),
        (y + 1, x),
        (y + 1, x + 1),
    ]

    for ay, ax in adjacent_positions:
        if (
            ay >= 0
            and ay < len(data)
            and ax >= 0
            and ax < len(data[ay])
            and data[ay][ax]
        ):
            total += 1

    return total


def find_accessible():
    for y in range(len(data)):
        for x in range(len(data[y])):
            if data[y][x] and count_adjacent(y, x) < 4:
                yield (y, x)


def remove_accessible():
    accessible = list(find_accessible())
    for y, x in accessible:
        data[y][x] = False
    return len(accessible)


removal_counts = []
while (removed := remove_accessible()) > 0:
    removal_counts.append(removed)


print(f"Star 1: {removal_counts[0]}")

print(f"Star 2: {sum(removal_counts)}")
