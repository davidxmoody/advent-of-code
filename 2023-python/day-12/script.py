from functools import cache


def format_line(line: str):
    (springs, checksum) = line.split(" ")
    checksum = [int(n) for n in checksum.split(",")]
    return (springs, checksum)


data = [format_line(line) for line in open("day-12/input.txt")]


@cache
def count_arrangements(i: int, mult=1, si=0, ci=0, cl=0):
    (s, c) = data[i]
    s = "?".join([s] * mult)
    c = c * mult

    if si >= len(s):
        if cl == 0:
            return 1 if ci == len(c) else 0
        else:
            return 1 if ci + 1 == len(c) and c[ci] == cl else 0

    else:
        count = 0

        if s[si] in ("#", "?"):
            if ci < len(c) and cl + 1 <= c[ci]:
                count += count_arrangements(i, mult, si + 1, ci, cl + 1)

        if s[si] in (".", "?"):
            if cl == 0:
                count += count_arrangements(i, mult, si + 1, ci, 0)
            elif c[ci] == cl:
                count += count_arrangements(i, mult, si + 1, ci + 1, 0)

        return count


print("Star 1:", sum((count_arrangements(i) for i in range(len(data)))))

print("Star 2:", sum((count_arrangements(i, mult=5) for i in range(len(data)))))
