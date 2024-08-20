from collections import Counter
from math import prod


tiles = {}

for line in open("day-20/input.txt").read().strip().split("\n\n"):
    header, *rows = line.split("\n")
    id = int(header[5:-1])
    tiles[id] = [[c == "#" for c in row] for row in rows]

size = len(next(iter(tiles.values()))[0])

edge_patterns = [
    [(0, i) for i in range(size)],
    [(i, 0) for i in range(size)],
    [(size - 1, i) for i in range(size)],
    [(i, size - 1) for i in range(size)],
]
edge_patterns += [list(reversed(p)) for p in edge_patterns]

edges = {}

for id, tile in tiles.items():
    for pattern in edge_patterns:
        edge = int("".join("1" if tile[y][x] else "0" for y, x in pattern), 2)
        if edge not in edges:
            edges[edge] = []
        edges[edge].append(id)

unmatched_edges = Counter(ids[0] for ids in edges.values() if len(ids) == 1)

corner_ids = [id for id, count in unmatched_edges.items() if count == 4]

print(f"Star 1: {prod(corner_ids)}")
