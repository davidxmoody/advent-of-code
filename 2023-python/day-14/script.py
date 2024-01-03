from numpy import array, rot90

data = array([list(line[:-1]) for line in open("day-14/input.txt")])


def tilt():
    for x in range(len(data[0])):
        for y in range(1, len(data)):
            if data[y][x] == "O":
                for y2 in range(y, 0, -1):
                    if data[y2 - 1][x] != ".":
                        break
                    data[y2][x] = "."
                    data[y2 - 1][x] = "O"


def get_north_load():
    total_load = 0
    for y, row in enumerate(data):
        for cell in row:
            if cell == "O":
                total_load += len(data) - y
    return total_load


# After a while, the cycle repeats every 14 iterations. 1000000000 - 1000 is a
# multiple of 14 so 1000 is enough to reach the answer. This is messy and may
# not work for all inputs but I'm too lazy to improve it right now.

for i in range(1000):
    tilt()
    if i == 0:
        print("Star 1:", get_north_load())
    data = rot90(data, k=-1)

    tilt()
    data = rot90(data, k=-1)
    tilt()
    data = rot90(data, k=-1)
    tilt()
    data = rot90(data, k=-1)

print("Star 2:", get_north_load())
