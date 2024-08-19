starting_numbers = [int(n) for n in open("day-15/input.txt").read().split(",")]


def run(iterations: int):
    prev = starting_numbers[-1]
    occurrences = {n: i for i, n in enumerate(starting_numbers[:-1])}

    for i in range(len(starting_numbers), iterations):
        next = 0 if prev not in occurrences else i - occurrences[prev] - 1
        occurrences[prev] = i - 1
        prev = next

    return prev


print(f"Star 1: {run(2020)}")

print(f"Star 2: {run(30000000)}")
