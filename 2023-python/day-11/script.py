from numpy import array, ndenumerate
from itertools import combinations

universe = array([[c == "#" for c in line[:-1]] for line in open("day-11/input.txt")])

galaxies = [p for p, c in ndenumerate(universe) if c]

empty_y = [y for y, line in enumerate(universe) if not line.any()]

empty_x = [x for x, col in enumerate(universe.T) if not col.any()]


def get_distance(a, b, expansion):
    y_gaps = len([e for e in empty_y if (a[0] < e < b[0]) or (a[0] > e > b[0])])
    x_gaps = len([e for e in empty_x if (a[1] < e < b[1]) or (a[1] > e > b[1])])
    return abs(a[0] - b[0]) + abs(a[1] - b[1]) + (expansion - 1) * (y_gaps + x_gaps)


def sum_distances(expansion):
    return sum([get_distance(a, b, expansion) for a, b in combinations(galaxies, 2)])


print("Star 1:", sum_distances(2))

print("Star 2:", sum_distances(1000000))
