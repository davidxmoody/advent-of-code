data = open("day-15/input.txt").read().strip().split(",")


def hash(input: str):
    value = 0
    for char in input:
        value += ord(char)
        value *= 17
        value %= 256
    return value


print("Star 1:", sum((hash(x) for x in data)))

boxes: list[list[tuple[str, int]]] = [[] for _ in range(256)]

for instruction in data:
    label = instruction[0 : -1 if instruction[-1] == "-" else -2]
    bi = hash(label)

    if instruction[-1] == "-":
        boxes[bi] = [lens for lens in boxes[bi] if lens[0] != label]

    else:
        focal_length = int(instruction[-1])
        if any((lens[0] == label for lens in boxes[bi])):
            boxes[bi] = [
                ((label, focal_length) if lens[0] == label else lens)
                for lens in boxes[bi]
            ]
        else:
            boxes[bi].append((label, focal_length))


focusing_power = 0

for bi, box in enumerate(boxes):
    for li, lens in enumerate(box):
        focusing_power += (bi + 1) * (li + 1) * lens[1]

print("Star 2:", focusing_power)
