data = [(l[0], int(l[1:-1])) for l in open("day-12/input.txt")]


def rotate_facing(facing: str, angle: int):
    compass = ["N", "E", "S", "W"]
    return compass[(compass.index(facing) + (angle // 90)) % 4]


facing = "E"
y, x = 0, 0

for action, value in data:
    if action == "F":
        action = facing

    match action:
        case "N":
            y += value
        case "S":
            y -= value
        case "E":
            x += value
        case "W":
            x -= value
        case "L":
            facing = rotate_facing(facing, 360 - value)
        case "R":
            facing = rotate_facing(facing, value)

print(f"Star 1: {abs(y) + abs(x)}")


def rotate_waypoint(wy: int, wx: int, angle: int):
    match angle:
        case 90:
            return (-wx, wy)
        case 180:
            return (-wy, -wx)
        case 270:
            return (wx, -wy)
        case _:
            raise Exception()


sy, sx = 0, 0
wy, wx = 1, 10

for action, value in data:
    match action:
        case "N":
            wy += value
        case "S":
            wy -= value
        case "E":
            wx += value
        case "W":
            wx -= value
        case "F":
            sy += wy * value
            sx += wx * value
        case "L":
            wy, wx = rotate_waypoint(wy, wx, 360 - value)
        case "R":
            wy, wx = rotate_waypoint(wy, wx, value)


print(f"Star 2: {abs(sy) + abs(sx)}")
