import re


with open("day-03/input.txt", "r") as f:
    data = f.readlines()


def is_symbol(char: str):
    return re.fullmatch(r"[^0-9.\n]", char)


def is_digit(char: str):
    return re.fullmatch(r"[0-9]", char)


def surrounding_points(y: int, x: int):
    for y2 in range(max(0, y - 1), min(len(data) - 1, y + 1) + 1):
        for x2 in range(max(0, x - 1), min(len(data[0]) - 1, x + 1) + 1):
            yield (y2, x2)


def capture_number(y: int, x: int):
    start = x
    while start > 0 and is_digit(data[y][start - 1]):
        start -= 1

    end = x
    while end < (len(data[y]) - 1) and is_digit(data[y][end + 1]):
        end += 1

    return int(data[y][start : end + 1])


def find_surrounding_numbers(y: int, x: int):
    surrounding: set[int] = set()
    for y2, x2 in surrounding_points(y, x):
        if is_digit(data[y2][x2]):
            surrounding.add(capture_number(y2, x2))
    return list(surrounding)


part_number_total = 0
gear_ratio_total = 0

for y, line in enumerate(data):
    for x, char in enumerate(line):
        if is_symbol(char):
            numbers = find_surrounding_numbers(y, x)

            for n in numbers:
                part_number_total += n

            if char == "*" and len(numbers) == 2:
                gear_ratio_total += numbers[0] * numbers[1]

print(f"Star 1: {part_number_total}")

print(f"Star 2: {gear_ratio_total}")
