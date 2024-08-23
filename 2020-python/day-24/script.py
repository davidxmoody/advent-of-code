import re
from typing import Counter


data = [re.findall(r"([ns]?[ew])", line) for line in open("day-24/input.txt")]

directions = {
    "ne": (1, 1),
    "e": (0, 2),
    "se": (-1, 1),
    "nw": (1, -1),
    "w": (0, -2),
    "sw": (-1, -1),
}

flipped_tiles = set[tuple[int, int]]()

for instructions in data:
    y, x = 0, 0
    for instruction in instructions:
        dy, dx = directions[instruction]
        y, x = y + dy, x + dx
    flipped_tiles ^= {(y, x)}

print(f"Star 1: {len(flipped_tiles)}")


for _ in range(100):
    adjacent_counts = Counter[tuple[int, int]]()
    for y, x in flipped_tiles:
        for dy, dx in directions.values():
            adjacent_counts[(y + dy, x + dx)] += 1

    new_flipped_tiles = set[tuple[int, int]]()

    for p, c in adjacent_counts.items():
        if c == 2 or (c == 1 and p in flipped_tiles):
            new_flipped_tiles.add(p)

    flipped_tiles = new_flipped_tiles

print(f"Star 2: {len(flipped_tiles)}")
