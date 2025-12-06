from math import prod


def calculate(nums: list[int], op: str):
    if op == "+":
        return sum(nums)
    elif op == "*":
        return prod(nums)
    else:
        raise Exception("Invalid operation")


lines = open("day-06/input.txt").readlines()

numbers = [[int(n) for n in line.split()] for line in lines[:-1]]
operations = lines[-1].split()

grand_total_v1 = sum(
    calculate([row[i] for row in numbers], op) for i, op in enumerate(operations)
)

print(f"Star 1: {grand_total_v1}")

grand_total_v2 = 0

current_nums = []
current_op = ""
for i in range(len(lines[0])):
    str_num = "".join(line[i] for line in lines[:-1]).strip()
    if str_num != "":
        current_nums.append(int(str_num))
        current_op = current_op if lines[-1][i] == " " else lines[-1][i]
    else:
        grand_total_v2 += calculate(current_nums, current_op)
        current_nums = []
        current_op = ""

print(f"Star 2: {grand_total_v2}")
