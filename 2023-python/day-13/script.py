from numpy import array
from numpy._typing import NDArray

groups = open("day-13/input.txt").read().split("\n\n")
data = [array([list(l) for l in g.strip().split("\n")]) for g in groups]


def is_reflection(grid: NDArray, i: int, smudge: bool):
    num_errors = 0
    for di in range(0, min(i, len(grid) - i)):
        num_errors += (grid[i - 1 - di] != grid[i + di]).sum()
    return num_errors == (1 if smudge else 0)


def find_reflection(grid: NDArray, smudge=False):
    for i in range(1, len(grid)):
        if is_reflection(grid, i, smudge):
            return i * 100

    for i in range(1, len(grid.T)):
        if is_reflection(grid.T, i, smudge):
            return i

    raise Exception("No reflection found")


print("Star 1:", sum((find_reflection(x) for x in data)))

print("Star 2:", sum((find_reflection(x, smudge=True) for x in data)))
