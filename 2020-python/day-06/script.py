from collections import Counter


groups = [
    group.strip().split() for group in open("day-06/input.txt").read().split("\n\n")
]


def count_any_yes(group: list[str]):
    unique = set[str]()
    for answers in group:
        unique.update(answers)
    return len(unique)


print(f"Star 1: {sum(count_any_yes(group) for group in groups)}")


def count_all_yes(group: list[str]):
    counter = Counter[str]()
    for answers in group:
        counter.update(answers)
    return len([c for c in counter.values() if c == len(group)])


print(f"Star 2: {sum(count_all_yes(group) for group in groups)}")
