p1, p2 = [int(line) for line in open("day-25/input.txt")]


def get_loop_size(subject_number: int, public_key: int):
    value = 1
    loops = 0

    while value != public_key:
        value = (value * subject_number) % 20201227
        loops += 1

    return loops


def transform(subject_number: int, loop_size: int):
    value = 1
    for _ in range(loop_size):
        value = (value * subject_number) % 20201227
    return value


encryption_key = transform(p2, get_loop_size(7, p1))

print(f"Star 1: {encryption_key}")
