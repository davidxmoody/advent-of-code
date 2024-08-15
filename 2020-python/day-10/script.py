from typing import Counter


adapters = sorted([int(v) for v in open("day-10/input.txt")])
adapters = [0] + adapters + [max(adapters) + 3]

differences = Counter()
jolts = adapters[0]

for v in adapters[1:]:
    differences[v - jolts] += 1
    jolts = v

print(f"Star 1: {differences[1] * differences[3]}")


ways_to_reach_end = {adapters[-1]: 1}

for v in adapters[-2::-1]:
    ways_to_reach_end[v] = 0
    for reachable in range(v + 1, v + 4):
        if reachable in ways_to_reach_end:
            ways_to_reach_end[v] += ways_to_reach_end[reachable]

print(f"Star 2: {ways_to_reach_end[0]}")
