from collections import Counter


def score_card(card: str, jokers: bool):
    if jokers and card == "J":
        return 1
    else:
        return "23456789TJQKA".index(card) + 2


def score_type(cards: str, jokers: bool):
    counter = Counter(cards)

    if jokers:
        j_count = counter["J"]
        counter["J"] = 0
        most_common_card = counter.most_common(1)[0][0]
        counter[most_common_card] += j_count

    return sum([x * x for x in counter.values()])


def score_cards(cards: str, jokers: bool):
    type_score = score_type(cards, jokers) * (100**5)
    cards_score = sum(
        [score_card(card, jokers) * (100 ** (4 - i)) for i, card in enumerate(cards)]
    )
    return type_score + cards_score


def calculate_winnings(hands: list[tuple[str, int]], jokers=False):
    sorted_hands = sorted(hands, key=lambda x: score_cards(x[0], jokers))
    return sum([(i + 1) * bid for i, (_, bid) in enumerate(sorted_hands)])


hands = [(line[:5], int(line[6:-1])) for line in list(open("day-07/input.txt"))]

print("Star 1:", calculate_winnings(hands))

print("Star 2:", calculate_winnings(hands, jokers=True))
