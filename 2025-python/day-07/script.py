lines = open("day-07/input.txt").read().splitlines()
beams = [int(c == "S") for c in lines[0]]

split_count = 0

for line in lines[1:]:
    for i, c in enumerate(line):
        if c == "^" and beams[i] > 0:
            split_count += 1
            beams[i - 1] += beams[i]
            beams[i + 1] += beams[i]
            beams[i] = 0

print(f"Star 1: {split_count}")

print(f"Star 2: {sum(beams)}")
