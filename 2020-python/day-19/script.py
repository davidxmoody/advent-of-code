import re


data = open("day-19/input.txt").read().split("\n\n")

messages = data[1].strip().split("\n")


def extract_rules():
    return {
        line.split(": ")[0]: f"(?:{line.split(": ")[1].replace('"', '')})"
        for line in data[0].split("\n")
    }


def collapse_rules(rules, preserve=["0"]):
    while len(rules) > 1:
        sub_id = next(
            (
                id
                for id, rule in rules.items()
                if (id not in preserve and not any(c.isdigit() for c in rule))
            ),
            None,
        )

        if sub_id is None:
            break

        sub_rule = rules.pop(sub_id)

        for id, rule in rules.items():
            rules[id] = re.sub(rf"\b{sub_id}\b", sub_rule, rule)

    return rules


rules = collapse_rules(extract_rules())
regex = re.compile(rules["0"], re.VERBOSE)

print(f"Star 1: {sum(1 for m in messages if regex.fullmatch(m))}")

rules2 = extract_rules()
rules2["8"] = "(?:42 | 42 8)"
rules2["11"] = "(?:42 31 | 42 11 31)"

rules2 = collapse_rules(rules2, ["42", "31"])

regex2 = re.compile(
    rf"(?P<first>({rules2["42"]})+?)(?P<second>({rules2["31"]})+)", re.VERBOSE
)


def valid2(message: str):
    match = regex2.fullmatch(message)
    if match is None:
        return False
    first_count = len(re.findall(rules2["42"], match.group("first"), re.VERBOSE))
    second_count = len(re.findall(rules2["31"], match.group("second"), re.VERBOSE))

    return first_count > second_count > 0


print(f"Star 2: {sum(1 for m in messages if valid2(m))}")
