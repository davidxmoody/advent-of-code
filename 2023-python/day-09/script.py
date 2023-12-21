import re


def extract_numbers(text: str):
    return [int(s) for s in re.findall(r"-?\d+", text)]


def diff_seq(seq: list[int]):
    return [seq[i + 1] - seq[i] for i in range(0, len(seq) - 1)]


def all_zeros(seq: list[int]):
    return all([n == 0 for n in seq])


def get_next(seq: list[int]):
    if all_zeros(seq):
        return 0
    return seq[-1] + get_next(diff_seq(seq))


def get_prev(seq: list[int]):
    if all_zeros(seq):
        return 0
    return seq[0] - get_prev(diff_seq(seq))


data = [extract_numbers(line) for line in list(open("day-09/input.txt"))]

print("Star 1:", sum([get_next(seq) for seq in data]))

print("Star 2:", sum([get_prev(seq) for seq in data]))
