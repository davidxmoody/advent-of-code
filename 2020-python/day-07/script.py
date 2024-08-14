import re


containers = {}

for line in open("day-07/input.txt"):
    if match := re.match(r"(.*) bags contain (.*)\.", line):
        container = match.group(1)
        contains = match.group(2).split(", ")

        containers[container] = {}

        if contains[0] == "no other bags":
            continue

        for c in contains:
            if m2 := re.match(r"(\d+) (.*) bags?", c):
                containers[container][m2.group(2)] = int(m2.group(1))

can_contain_sg = set[str]()
current_edge = {"shiny gold"}

while len(current_edge):
    next = current_edge.pop()
    can_contain_next = {k for k, v in containers.items() if next in v}
    unexplored = can_contain_next - can_contain_sg
    current_edge.update(unexplored)
    can_contain_sg.update(unexplored)

print(f"Star 1: {len(can_contain_sg)}")


def count_bags(bag: str):
    return sum(v * (1 + count_bags(k)) for k, v in containers[bag].items())


print(f"Star 2: {count_bags("shiny gold")}")
