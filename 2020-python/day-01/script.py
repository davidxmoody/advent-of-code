from math import prod
from itertools import combinations

data = [int(line) for line in open("day-01/input.txt")]


def solve(num_values: int):
    for values in combinations(data, num_values):
        if sum(values) == 2020:
            return prod(values)


print(f"Star 1: {solve(2)}")

print(f"Star 2: {solve(3)}")
