import re


def parse_card(line: str):
    match = re.match(r"Card +\d+: (.*) \| (.*)", line)
    if match is None:
        raise Exception("Could not parse")

    winning = set((int(x) for x in re.findall(r"\d+", match.group(1))))
    ours = set((int(x) for x in re.findall(r"\d+", match.group(2))))

    return len(winning.intersection(ours))


cards = [parse_card(line) for line in list(open("day-04/input.txt"))]

print("Star 1:", sum((2 ** (card - 1) if card > 0 else 0 for card in cards)))

num_copies = [1 for _ in cards]

for i in range(0, len(cards)):
    for j in range(i + 1, i + cards[i] + 1):
        num_copies[j] += num_copies[i]

print("Star 2:", sum(num_copies))
