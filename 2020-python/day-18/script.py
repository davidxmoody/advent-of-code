import re


exprs = [l.strip() for l in open("day-18/input.txt")]


def evaluate(expr: str, ltr: bool):
    while "(" in expr:
        expr = re.sub(r"\(([^()]+)\)", lambda m: evaluate(m.group(1), ltr), expr)

    if ltr:
        while "+" in expr or "*" in expr:
            expr = re.sub(r"^\d+ [*+] \d+", lambda m: str(eval(m.group(0))), expr, 1)

    else:
        for c in ("+", "*"):
            while c in expr:
                expr = re.sub(
                    rf"\d+ \{c} \d+", lambda m: str(eval(m.group(0))), expr, 1
                )

    return expr


print(f"Star 1: {sum(int(evaluate(expr, True)) for expr in exprs)}")

print(f"Star 2: {sum(int(evaluate(expr, False)) for expr in exprs)}")
