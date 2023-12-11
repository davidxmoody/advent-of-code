import re

text_numbers = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
]


def word_to_num(maybe_word: str):
    if maybe_word in text_numbers:
        return text_numbers.index(maybe_word) + 1
    else:
        return int(maybe_word)


def extract_two_digits(line: str, parse_words: bool):
    match_part = rf"({'|'.join(text_numbers)}|\d)" if parse_words else r"(\d)"

    first = re.search(f".*?{match_part}.*", line)
    last = re.search(f".*{match_part}.*", line)

    if first is None or last is None:
        raise Exception("Could not find numbers")

    return word_to_num(first.group(1)) * 10 + word_to_num(last.group(1))


def calculate_answer(lines: list[str], parse_words=False):
    return sum([extract_two_digits(line, parse_words=parse_words) for line in lines])


with open("day-01/input.txt", "r") as f:
    lines = f.readlines()
    print(f"Star 1: {calculate_answer(lines)}")
    print(f"Star 2: {calculate_answer(lines, parse_words=True)}")
