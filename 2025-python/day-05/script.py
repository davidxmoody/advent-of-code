fresh_ranges: list[tuple[int, int]] = []
available: list[int] = []

for line in open("day-05/input.txt"):
    if "-" in line:
        start, end = line.split("-")
        fresh_ranges.append((int(start), int(end)))
    elif line != "\n":
        available.append(int(line))

fresh_ranges = sorted(fresh_ranges)

simplified_ranges = [fresh_ranges.pop(0)]

while len(fresh_ranges):
    current_start, current_end = simplified_ranges[-1]
    next_start, next_end = fresh_ranges.pop(0)

    if current_end < next_start:
        simplified_ranges.append((next_start, next_end))
    else:
        simplified_ranges[-1] = (current_start, max(current_end, next_end))


def is_fresh(id: int):
    for start, end in simplified_ranges:
        if start <= id <= end:
            return True
    return False


print(f"Star 1: {sum(is_fresh(id) for id in available)}")

print(f"Star 2: {sum(end - start + 1 for start, end in simplified_ranges)}")
