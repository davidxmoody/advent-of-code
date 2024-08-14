seats = [l.strip() for l in open("day-05/input.txt")]


def get_seat_id(seat: str):
    mapping = {"F": "0", "B": "1", "L": "0", "R": "1"}
    binary = "".join(mapping[c] for c in seat)
    return int(binary, 2)


seat_ids = sorted(get_seat_id(seat) for seat in seats)


print(f"Star 1: {max(seat_ids)}")


def find_missing():
    for i in range(0, len(seat_ids) - 1):
        if seat_ids[i + 1] != seat_ids[i] + 1:
            return seat_ids[i] + 1


print(f"Star 2: {find_missing()}")
