import re
from itertools import pairwise


reports = [
    [int(s) for s in re.findall(r"\d+", line)] for line in open("day-02/input.txt")
]


def is_safe(report: list[int], dampen: bool = False):
    for a, b in pairwise(report):
        gap = b - a
        if 1 <= gap <= 3:
            increases += 1
        elif -3 <= gap <= -1:
            decreases += 1
        else:
            errors += 1

    return errors <= (1 if dampen else 0)


print(f"Star 1: {sum(is_safe(r) for r in reports)}")

print(f"Star 2: {sum(is_safe(r, dampen=True) for r in reports)}")
