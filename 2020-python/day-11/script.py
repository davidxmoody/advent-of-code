from copy import deepcopy


initial_seats = [[c for c in l.strip()] for l in open("day-11/input.txt")]

height, width = len(initial_seats), len(initial_seats[0])

vectors = [
    (-1, -1),
    (-1, 0),
    (-1, 1),
    (0, -1),
    (0, 1),
    (1, -1),
    (1, 0),
    (1, 1),
]


def out_of_bounds(y: int, x: int):
    return y < 0 or x < 0 or y >= height or x >= width


def follow_path(
    seats: list[list[str]], y: int, x: int, dy: int, dx: int, skip_floor: bool
):
    while True:
        y += dy
        x += dx
        if out_of_bounds(y, x):
            return False
        if seats[y][x] == "." and skip_floor:
            continue
        return seats[y][x] == "#"


def count_adjacent_filled(seats: list[list[str]], y: int, x: int, skip_floor: bool):
    return sum(follow_path(seats, y, x, dy, dx, skip_floor) for dy, dx in vectors)


def count_occupied(seats: list[list[str]]):
    return sum([sum([s == "#" for s in row]) for row in seats])


def simulate(seats: list[list[str]], threshold: int, skip_floor: bool):
    new_seats = deepcopy(seats)

    for y in range(height):
        for x in range(width):
            adjacent_filled = count_adjacent_filled(seats, y, x, skip_floor)
            if adjacent_filled == 0 and seats[y][x] == "L":
                new_seats[y][x] = "#"
            if adjacent_filled >= threshold and seats[y][x] == "#":
                new_seats[y][x] = "L"

    return new_seats


def simulate_until_stable(threshold: int, skip_floor: bool):
    seats = initial_seats
    while True:
        new_seats = simulate(seats, threshold, skip_floor)
        if new_seats == seats:
            return count_occupied(new_seats)
        seats = new_seats


print(f"Star 1: {simulate_until_stable(4, False)}")

print(f"Star 2: {simulate_until_stable(5, True)}")
