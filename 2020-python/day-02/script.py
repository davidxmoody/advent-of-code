import re

data = list(open("day-02/input.txt"))

pattern = r"(\d+)-(\d+) (.): (.*)"


def is_valid(line: str):
    if match := re.match(pattern, line):
        min, max, letter, password = match.groups()
        return int(min) <= password.count(letter) <= int(max)
    return False


print(f"Star 1: {sum(is_valid(line) for line in data)}")


def is_valid_2(line: str):
    if match := re.match(pattern, line):
        p1, p2, letter, password = match.groups()

        valid1 = password[int(p1) - 1] == letter
        valid2 = password[int(p2) - 1] == letter

        return valid1 ^ valid2

    return False


print(f"Star 2: {sum(is_valid_2(line) for line in data)}")
