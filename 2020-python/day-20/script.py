from collections import defaultdict
from math import prod, floor

type Image = list[list[bool]]

tiles: dict[int, Image] = {}

for line in open("day-20/input.txt").read().strip().split("\n\n"):
    header, *rows = line.split("\n")
    id = int(header[5:-1])
    tiles[id] = [[c == "#" for c in row] for row in rows]

tile_size = len(next(iter(tiles.values()))[0])


def rotate(image: Image):
    return [list(row) for row in zip(*image[::-1])]


def flip(image: Image):
    return [row[::-1] for row in image]


def all_transforms(image: Image):
    for im in (image, flip(image)):
        for _ in range(4):
            yield im
            im = rotate(im)


edges = defaultdict[int, list[int]](list)

for id, tile in tiles.items():
    for ttile in all_transforms(tile):
        edge = int("".join("1" if ttile[0][x] else "0" for x in range(tile_size)), 2)
        edges[edge].append(id)

adjacency = defaultdict[int, list[int]](list)

for a, b in {(ids[0], ids[1]) for ids in edges.values() if len(ids) == 2}:
    adjacency[a].append(b)
    adjacency[b].append(a)

corner_ids = [id for id, adj in adjacency.items() if len(adj) == 2]

print(f"Star 1: {prod(corner_ids)}")

starting_id = corner_ids[0]
tile_positions: dict[int, tuple[tuple[int, int], Image]] = {
    starting_id: ((0, 0), tiles[starting_id])
}
unchecked_ids = {starting_id}

while len(tile_positions) < len(tiles):
    next_id = unchecked_ids.pop()
    (next_y, next_x), next_tile = tile_positions[next_id]

    for adjacent_id in adjacency[next_id]:
        if adjacent_id not in tile_positions:
            for ttile in all_transforms(tiles[adjacent_id]):
                if ttile[0] == next_tile[tile_size - 1]:
                    tile_positions[adjacent_id] = ((next_y + 1, next_x), ttile)
                    unchecked_ids.add(adjacent_id)

                elif ttile[tile_size - 1] == next_tile[0]:
                    tile_positions[adjacent_id] = ((next_y - 1, next_x), ttile)
                    unchecked_ids.add(adjacent_id)

                elif all(
                    ttile[y][0] == next_tile[y][tile_size - 1] for y in range(tile_size)
                ):
                    tile_positions[adjacent_id] = ((next_y, next_x + 1), ttile)
                    unchecked_ids.add(adjacent_id)

                elif all(
                    ttile[y][tile_size - 1] == next_tile[y][0] for y in range(tile_size)
                ):
                    tile_positions[adjacent_id] = ((next_y, next_x - 1), ttile)
                    unchecked_ids.add(adjacent_id)


grid_size = floor(len(tiles) ** 0.5) * (tile_size - 2)
grid = [[False for _ in range(grid_size)] for _ in range(grid_size)]

for pos, tile in tile_positions.values():
    start_y = pos[0] * (tile_size - 2)
    start_x = pos[1] * (tile_size - 2)

    for y in range(tile_size - 2):
        for x in range(tile_size - 2):
            grid[start_y + y][start_x + x] = tile[y + 1][x + 1]


def print_image(image: Image):
    for row in image:
        print("".join("#" if c else "." for c in row))


monster_rows = [
    "                  # ",
    "#    ##    ##    ###",
    " #  #  #  #  #  #   ",
]
monster_height, monster_width = len(monster_rows), len(monster_rows[0])

monster_points = set[tuple[int, int]]()
for y, row in enumerate(monster_rows):
    for x, c in enumerate(row):
        if c == "#":
            monster_points.add((y, x))

total_roughness = sum(sum(row) for row in grid)

for tgrid in all_transforms(grid):
    monster_count = 0
    for y in range(0, grid_size - monster_height + 1):
        for x in range(0, grid_size - monster_width + 1):
            if all(tgrid[y + dy][x + dx] for dy, dx in monster_points):
                monster_count += 1

    if monster_count > 0:
        print(f"Star 2: {total_roughness - monster_count * len(monster_points)}")
