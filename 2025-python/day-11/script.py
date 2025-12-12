data = {line[:3]: set(line[5:-1].split()) for line in open("day-11/input.txt")}

inverted: dict[str, set[str]] = {}
for src, dests in data.items():
    for dest in dests:
        if dest not in inverted:
            inverted[dest] = set()
        inverted[dest].add(src)


def find_reachable(start: str):
    reachable = set[str]()
    unexplored = {start}

    while unexplored:
        next = unexplored.pop()
        reachable.add(next)
        if next in data:
            for child in data[next]:
                if child not in reachable:
                    unexplored.add(child)

    return reachable


def count_paths(start: str, end: str):
    reachable = find_reachable(start)
    unknown = set(reachable) - {start}
    known = {start: 1}

    while end not in known:
        for dest in unknown:
            if all((src in known or src not in reachable) for src in inverted[dest]):
                known[dest] = sum(known.get(src, 0) for src in inverted[dest])
                unknown.remove(dest)
                break
        else:
            raise Exception("Cannot find path")

    return known[end]


print(f"Star 1: {count_paths("you", "out")}")


print(
    f"Star 2: {count_paths("svr", "fft") * count_paths("fft", "dac") *count_paths("dac", "out")}"
)
