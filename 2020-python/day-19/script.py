import re


data = open("day-19/input.txt").read().split("\n\n")

messages = data[1].strip().split("\n")

rules = {
    line.split(": ")[0]: f"({line.split(": ")[1].replace('"', '')})"
    for line in data[0].split("\n")
}

while len(rules) > 1:
    sub_id = next(
        (id for id, rule in rules.items() if not any(c.isdigit() for c in rule)),
        None,
    )

    if sub_id is None:
        raise Exception()

    sub_rule = rules.pop(sub_id)

    for id, rule in rules.items():
        rules[id] = re.sub(rf"\b{sub_id}\b", sub_rule, rule)

regex = re.compile(rules["0"], re.VERBOSE)

print(f"Star 1: {sum(1 for m in messages if regex.fullmatch(m))}")
