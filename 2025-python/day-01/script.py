rotations = [
    (1 if l[0] == "R" else -1) * int(l[1:].strip()) for l in open("day-01/input.txt")
]

dial = 50

after_rotation_zeros = 0
during_rotation_zeros = 0

for rot in rotations:
    loops, dial = divmod(dial + rot, 100)
    if dial == 0:
        after_rotation_zeros += 1
    during_rotation_zeros += abs(loops)

print(f"Star 1: {after_rotation_zeros}")

print(f"Star 2: {during_rotation_zeros}")
