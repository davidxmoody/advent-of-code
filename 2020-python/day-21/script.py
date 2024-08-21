import re


foods = []
for line in open("day-21/input.txt"):
    if match := re.match(r"(.*) \(contains (.*)\)", line):
        ingredients = set(match.group(1).split(" "))
        allergens = set(match.group(2).split(", "))
        foods.append((ingredients, allergens))

all_allergens = {a for _, allergens in foods for a in allergens}
all_ingredients = {i for ingredients, _ in foods for i in ingredients}

potential_mapping = {a: all_ingredients for a in all_allergens}
for ingredients, allergens in foods:
    for a in allergens:
        potential_mapping[a] = potential_mapping[a] & ingredients

while any(len(ins) > 1 for ins in potential_mapping.values()):
    singles = {next(iter(ins)) for ins in potential_mapping.values() if len(ins) == 1}
    for a, ins in potential_mapping.items():
        if len(ins) > 1:
            potential_mapping[a] = ins - singles

mapping = {i: next(iter(a)) for i, a in potential_mapping.items()}

print(
    f"Star 1: {sum(len(ingredients - set(mapping.values())) for ingredients, _ in foods)}"
)

print(f"Star 2: {",".join(mapping[a] for a in sorted(mapping))}")
