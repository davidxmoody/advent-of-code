from math import prod
import re


data = open("day-16/input.txt").read().split("\n\n")

fields: dict[str, list[tuple[int, int]]] = {}
for line in data[0].split("\n"):
    if match := re.match(r"(.*): (\d+)-(\d+) or (\d+)-(\d+)", line):
        name, v1, v2, v3, v4 = match.groups()
        fields[name] = [(int(v1), int(v2)), (int(v3), int(v4))]

ours = [int(n) for n in data[1].split("\n")[1].split(",")]

nearby = [[int(n) for n in line.split(",")] for line in data[2].strip().split("\n")[1:]]


def in_range(num: int, ranges: list[tuple[int, int]]):
    return any(a <= num <= b for a, b in ranges)


def invalid_number(num: int):
    return not any(in_range(num, ranges) for ranges in fields.values())


error_rate = 0
for ticket in nearby:
    for num in ticket:
        if invalid_number(num):
            error_rate += num

print(f"Star 1: {error_rate}")


valid_tickets = [
    ticket for ticket in nearby if not any(invalid_number(num) for num in ticket)
]

positions = [list(fields.keys()) for _ in fields.keys()]

for ticket in valid_tickets:
    for i, num in enumerate(ticket):
        for candidate_field_name in positions[i][:]:
            if not in_range(num, fields[candidate_field_name]):
                positions[i].remove(candidate_field_name)

while any(len(ps) > 1 for ps in positions):
    for ps in positions:
        if len(ps) == 1:
            for ps2 in positions:
                if ps[0] in ps2 and ps != ps2:
                    ps2.remove(ps[0])

departure_indexes = [
    i for i, fields in enumerate(positions) if fields[0].startswith("departure")
]

print(f"Star 2: {prod(ours[i] for i in departure_indexes)}")
