from collections.abc import Callable
from math import lcm

data = list(open("day-08/input.txt"))
instructions = [0 if x == "L" else 1 for x in data[0][:-1]]
nodes = {line[0:3]: (line[7:10], line[12:15]) for line in data[2:]}


def path_length(node: str, is_end: Callable[[str], bool]):
    steps = 0
    while not is_end(node):
        node = nodes[node][instructions[steps % len(instructions)]]
        steps += 1
    return steps


star1answer = path_length("AAA", lambda n: n == "ZZZ")
print("Star 1:", star1answer)

star2answer = lcm(
    *[path_length(n, lambda n2: n2[2] == "Z") for n in nodes.keys() if n[2] == "A"]
)
print("Star 2:", star2answer)
