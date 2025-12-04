banks = [[int(c) for c in line.strip()] for line in open("day-03/input.txt")]


def find_first_highest(bank: list[int], start: int, end: int):
    highest_value = 0
    highest_index = 0

    for i in range(start, end):
        if bank[i] > highest_value:
            highest_value = bank[i]
            highest_index = i
        if highest_value == 9:
            break

    return (highest_value, highest_index)


def max_joltage(bank: list[int], digits: int):
    start = 0
    end = len(bank) - digits + 1
    joltage = 0

    for digit in range(0, digits):
        j, i = find_first_highest(bank, start, end)
        start = i + 1
        end = end + 1
        joltage += 10 ** (digits - digit - 1) * j

    return joltage


print(f"Star 1: {sum(max_joltage(bank, 2) for bank in banks)}")

print(f"Star 2: {sum(max_joltage(bank, 12) for bank in banks)}")
