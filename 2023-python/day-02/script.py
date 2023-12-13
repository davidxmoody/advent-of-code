import re


def match_groups(regex: str, line: str):
    result = re.match(regex, line)
    if result is None:
        raise Exception("Could not match")
    return result.groups()


def process_game(line: str):
    minimums = {"red": 0, "green": 0, "blue": 0}

    game_match = match_groups(r"Game (\d+): (.*)", line)
    game_num = int(game_match[0])
    draws = game_match[1].split("; ")

    for draw in draws:
        for color_group in draw.split(", "):
            (num, color) = match_groups(r"(\d+) (red|green|blue)", color_group)
            minimums[color] = max(minimums[color], int(num))

    return (game_num, minimums)


games = [process_game(line) for line in list(open("day-02/input.txt"))]

star1 = sum(
    [
        game[0]
        for game in games
        if game[1]["red"] <= 12 and game[1]["green"] <= 13 and game[1]["blue"] <= 14
    ]
)

print("Star 1:", star1)

star2 = sum([game[1]["red"] * game[1]["green"] * game[1]["blue"] for game in games])

print("Star 2:", star2)
