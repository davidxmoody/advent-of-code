from math import ceil

from sympy.ntheory.modular import solve_congruence


data = list(open("day-13/input.txt"))

earliest = int(data[0])
ids = data[1].strip().split(",")

int_ids = [int(id) for id in ids if id.isdigit()]
waiting_times = [ceil(earliest / id) * id - earliest for id in int_ids]
soonest_index = waiting_times.index(min(waiting_times))

print(f"Star 1: {int_ids[soonest_index] * waiting_times[soonest_index]}")


offset_ids = [(offset, int(id)) for offset, id in enumerate(ids) if id.isdigit()]

remainder_modulus_pairs = [
    (ceil(offset / id) * id - offset, id) for offset, id in offset_ids
]

t = solve_congruence(*remainder_modulus_pairs)

print(f"Star 2: {t[0] if t else None}")
