from itertools import combinations


data = [int(n) for n in open("day-09/input.txt")]


def has_pair(target: int, nums: list[int]):
    for a, b in combinations(nums, 2):
        if a + b == target:
            return True
    return False


def find_invalid():
    for i in range(25, len(data)):
        if not has_pair(data[i], data[i - 25 : i]):
            return data[i]


invalid = find_invalid()

print(f"Star 1: {invalid}")


def find_weakness():
    for start in range(0, len(data) - 2):
        for end in range(start + 2, len(data)):
            if sum(data[start:end]) == invalid:
                return min(data[start:end]) + max(data[start:end])


print(f"Star 2: {find_weakness()}")
