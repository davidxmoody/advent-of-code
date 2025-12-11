data = {line[:3]: line[5:-1].split() for line in open("day-11/input.txt")}


def count_paths(start: str, end: str):
    if start == end:
        return 1
    return sum(count_paths(node, end) for node in data[start])


print(f"Star 1: {count_paths("you", "out")}")
