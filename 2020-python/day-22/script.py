initial_d1, initial_d2 = [
    [int(line) for line in chunk.split("\n")[1:]]
    for chunk in open("day-22/input.txt").read().strip().split("\n\n")
]


def score_deck(d: list[int]):
    return sum(c * (len(d) - i) for i, c in enumerate(d))


def combat(d1: list[int], d2: list[int]):
    d1, d2 = d1[:], d2[:]

    while len(d1) > 0 and len(d2) > 0:
        c1 = d1.pop(0)
        c2 = d2.pop(0)

        p1_wins = c1 > c2

        if p1_wins:
            d1.extend([c1, c2])
        else:
            d2.extend([c2, c1])

    return score_deck(d1 if len(d1) > len(d2) else d2)


print(f"Star 1: {combat(initial_d1, initial_d2)}")


def recombat(d1: list[int], d2: list[int]):
    d1, d2 = d1[:], d2[:]

    seen_states = set()
    state = ((*d1,), (*d2,))

    while len(d1) > 0 and len(d2) > 0:
        state = ((*d1,), (*d2,))

        if state in seen_states:
            return (True, d1)
        else:
            seen_states.add(state)

        c1 = d1.pop(0)
        c2 = d2.pop(0)

        can_recurse = len(d1) >= c1 and len(d2) >= c2

        if can_recurse:
            (p1_wins, _) = recombat(d1[:c1], d2[:c2])
        else:
            p1_wins = c1 > c2

        if p1_wins:
            d1.extend([c1, c2])
        else:
            d2.extend([c2, c1])

    return (len(d1) > len(d2), d1 if len(d1) > len(d2) else d2)


print(f"Star 2: {score_deck(recombat(initial_d1, initial_d2)[1])}")
