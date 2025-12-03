ranges = sorted(
    (int(r.split("-")[0]), int(r.split("-")[1]))
    for r in open("day-02/input.txt").read().strip().split(",")
)


def is_invalid(id: int, max_reps: int | None = None):
    str_id = str(id)

    if max_reps is None:
        max_reps = len(str_id)

    for reps in range(2, max_reps + 1):
        if len(str_id) % reps != 0:
            continue
        size = len(str_id) // reps
        parts = [str_id[i : i + size] for i in range(0, len(str_id), size)]
        if all(part == parts[0] for part in parts):
            return True

    return False


invalid_sum_v1 = sum(
    id for start, end in ranges for id in range(start, end + 1) if is_invalid(id, 2)
)

print(f"Star 1: {invalid_sum_v1}")

invalid_sum_v2 = sum(
    id for start, end in ranges for id in range(start, end + 1) if is_invalid(id)
)

print(f"Star 1: {invalid_sum_v2}")
