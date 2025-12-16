class Present:
    def __init__(self, lines: list[str]):
        self.lines = lines

    @property
    def size(self):
        return sum(sum(c == "#" for c in line) for line in self.lines)

    def __repr__(self):
        return str(self.lines)


class Area:
    def __init__(self, line: str):
        dimensions, presents = line.split(": ")
        self.dimensions = tuple(int(n) for n in dimensions.split("x"))
        self.presents = tuple(int(n) for n in presents.split(" "))

    @property
    def size(self):
        return self.dimensions[0] * self.dimensions[1]

    def __repr__(self):
        return str((self.size, self.presents))


lines = open("day-12/input.txt").read().splitlines()

presents = [Present(lines[i * 5 + 1 : i * 5 + 4]) for i in range(6)]

areas = [Area(line) for line in lines[5 * 6 :]]


def presents_fit(area: Area):
    presents_size = sum(presents[i].size * num for i, num in enumerate(area.presents))
    return area.size >= presents_size


print(f"Star 1: {sum(presents_fit(area) for area in areas) }")
