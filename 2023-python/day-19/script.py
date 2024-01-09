import re
from numpy import prod


def parse_rule(rule: str):
    parts = rule.split(":")

    if len(parts) == 1:
        return ("x", ">", 0, parts[0])

    (cond, result) = parts

    prop = cond[0]
    comp = cond[1]
    val = int(cond[2:])

    return (prop, comp, val, result)


workflows = {}
parts = []

for line in open("day-19/input.txt"):
    if workflow := re.match(r"([a-z]+)\{(.*)\}", line):
        workflows[workflow[1]] = [parse_rule(rule) for rule in workflow[2].split(",")]

    elif part := re.match(r"\{(.*)\}", line):
        parts.append({kv[0]: int(kv[2:]) for kv in part[1].split(",")})


def is_accepted(part, label="in"):
    for prop, comp, val, result in workflows[label]:
        if part[prop] > val if comp == ">" else part[prop] < val:
            if result == "A":
                return True
            if result == "R":
                return False
            else:
                return is_accepted(part, result)


def get_rating(part):
    return part["x"] + part["m"] + part["a"] + part["s"]


print("Star 1:", sum((get_rating(part) for part in parts if is_accepted(part))))


def split_range(r, comp, val):
    if comp == "<":
        if r[1] < val:
            return (r, None)
        elif not r[0] < val:
            return (None, r)
        else:
            return ((r[0], val - 1), (val, r[1]))
    else:
        if r[0] > val:
            return (r, None)
        elif not r[1] > val:
            return (None, r)
        else:
            return ((val + 1, r[1]), (r[0], val))


def count_ranges(ranges):
    return prod([(b - a + 1) for a, b in ranges.values()])


initial_ranges = {"x": (1, 4000), "m": (1, 4000), "a": (1, 4000), "s": (1, 4000)}


def find_accepted_ranges(label="in", ranges=initial_ranges):
    for prop, comp, val, result in workflows[label]:
        (r_if_true, r_if_false) = split_range(ranges[prop], comp, val)

        if result == "A":
            yield count_ranges({**ranges, prop: r_if_true})
        elif result != "R":
            yield from find_accepted_ranges(result, {**ranges, prop: r_if_true})

        ranges = {**ranges, prop: r_if_false}


print("Star 2:", sum(find_accepted_ranges()))
