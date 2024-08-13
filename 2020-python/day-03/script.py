from math import prod


data = list([c for c in l.strip()] for l in open("day-03/input.txt"))

height, width = len(data), len(data[0])


def count_trees(dy: int, dx: int):
    y, x, trees = 0, 0, 0

    while y < height:
        if data[y][x] == "#":
            trees += 1
        y += dy
        x = (x + dx) % width

    return trees


print(f"Star 1: {count_trees(1, 3)}")

slopes = [(1, 1), (1, 3), (1, 5), (1, 7), (2, 1)]

print(f"Star 2: {prod(count_trees(dy, dx) for dy, dx in slopes)}")
