import re


def extract_numbers(text: str):
    return [int(s) for s in re.findall(r"\d+", text)]


data = list(open("day-05/input.txt"))


mappings: list[list[tuple[int, int, int]]] = []
for line in data[1:]:
    if line == "\n":
        mappings.append([])
    elif line[0].isdigit():
        (dest, source, width) = extract_numbers(line)
        mappings[-1].append((dest, source, width))
mappings = [sorted(mapping, key=lambda x: x[1]) for mapping in mappings]


def apply_mapping(id: tuple[int, int], mapping: list[tuple[int, int, int]]):
    (id_start, id_width) = id
    for dest, source, width in mapping:
        if id_width == 0:
            break

        if id_start < source:
            if id_start + id_width - 1 < source:
                yield (id_start, id_width)
                break
            else:
                chunk_width = source - id_start
                yield (id_start, chunk_width)
                id_start = source
                id_width = id_width - chunk_width

        if id_start <= source + width - 1:
            if id_start + id_width - 1 <= source + width - 1:
                yield (id_start - source + dest, id_width)
                break
            else:
                chunk_width = width - id_start + source
                yield (id_start - source + dest, chunk_width)
                id_start = id_start + chunk_width
                id_width = id_width - chunk_width


def find_min_location(ids: list[tuple[int, int]]):
    for mapping in mappings:
        next_ids = []
        for id in ids:
            for next_id in apply_mapping(id, mapping):
                next_ids.append(next_id)
        ids = next_ids

    return min((id_start for (id_start, _) in ids))


seeds = extract_numbers(data[0])

star1seeds = [(id_start, int(1)) for id_start in seeds]

print("Star 1:", find_min_location(star1seeds))

star2seeds = [(seeds[i * 2], seeds[i * 2 + 1]) for i in range(0, len(seeds) // 2)]

print("Star 2:", find_min_location(star2seeds))
