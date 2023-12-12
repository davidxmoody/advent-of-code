import re


with open("day-03/input.txt", "r") as f:
    data = f.readlines()


def has_surrounding_symbol(y: int, x: int):
    for y2 in range(max(0, y - 1), min(len(data) - 1, y + 1) + 1):
        for x2 in range(max(0, x - 1), min(len(data[0]) - 1, x + 1) + 1):
            char = data[y2][x2]
            if re.match(r"[^0-9.\n]", char):
                return True
    return False


total = 0

current_num = 0
current_symbol = False

for y, line in enumerate(data):
    for x, char in enumerate(line):
        try:
            digit = int(char)
            current_num = current_num * 10 + digit
            current_symbol = current_symbol or has_surrounding_symbol(y=y, x=x)

        except ValueError:
            if current_symbol:
                total += current_num
            current_num = 0
            current_symbol = False

print(f"Star 1: {total}")
