import heapq
from math import dist, prod
from itertools import combinations, count
from collections import Counter

boxes = [
    tuple(int(n) for n in line.split(","))
    for line in open("day-08/input.txt").read().splitlines()
]

distances = []
for box1, box2 in combinations(boxes, 2):
    heapq.heappush(distances, (dist(box1, box2), (box1, box2)))

circuits = {box: i for i, box in enumerate(boxes)}

num_connections = 0

for i in count():
    _, (box1, box2) = heapq.heappop(distances)
    old_cid, new_cid = circuits[box1], circuits[box2]
    if old_cid != new_cid:
        num_connections += 1
        for b in boxes:
            if circuits[b] == old_cid:
                circuits[b] = new_cid

    if i == 999:
        print(
            f"Star 1: {prod(c for _, c in Counter(circuits.values()).most_common(3))}"
        )

    if num_connections == 999:
        print(f"Star 2: {box1[0] * box2[0]}")
        break
