from typing import NamedTuple
from dataclasses import dataclass
from bisect import insort


class Point(NamedTuple):
    x: int
    y: int
    z: int


@dataclass
class Brick:
    initial_start: Point
    initial_end: Point
    offset = 0

    def lowest_z(self):
        return min(self.initial_start.z, self.initial_end.z) - self.offset

    def highest_z(self):
        return max(self.initial_start.z, self.initial_end.z) - self.offset


def parse_line(line: str):
    (start, end) = line.split("~")
    start_p = Point(*[int(n) for n in start.split(",")])
    end_p = Point(*[int(n) for n in end.split(",")])
    return Brick(start_p, end_p)


falling_bricks = [parse_line(line[:-1]) for line in open("day-22/input.txt")]
stable_bricks: list[Brick] = []


def overlap(a: tuple[int, int], b: tuple[int, int]):
    return not (max(*a) < min(*b) or max(*b) < min(*a))


def plane_overlap(b1: Brick, b2: Brick):
    b1x = (b1.initial_start.x, b1.initial_end.x)
    b1y = (b1.initial_start.y, b1.initial_end.y)
    b2x = (b2.initial_start.x, b2.initial_end.x)
    b2y = (b2.initial_start.y, b2.initial_end.y)
    return overlap(b1x, b2x) and overlap(b1y, b2y)


def find_supporting_bricks(brick: Brick):
    supports: list[Brick] = []
    for stable_brick in reversed(stable_bricks):
        if plane_overlap(stable_brick, brick):
            if len(supports) == 0:
                supports.append(stable_brick)
            elif supports[0].highest_z() == stable_brick.highest_z():
                supports.append(stable_brick)
            else:
                return supports
    return supports


support_pairs: list[tuple[Brick, Brick]] = []


for brick in sorted(falling_bricks, key=Brick.lowest_z):
    supports = find_supporting_bricks(brick)
    for support in supports:
        support_pairs.append((support, brick))
    new_height = supports[0].highest_z() + 1 if len(supports) else 1
    brick.offset = brick.lowest_z() - new_height
    insort(stable_bricks, brick, key=Brick.highest_z)


def get_supported(bottom_brick: Brick):
    return [top for bottom, top in support_pairs if bottom == bottom_brick]


def get_supporting(top_brick: Brick):
    return [bottom for bottom, top in support_pairs if top == top_brick]


def num_supported(brick: Brick):
    next_bricks = [brick]
    marked_bricks = [brick]

    while len(next_bricks):
        next_brick = next_bricks.pop(0)

        for supported_brick in get_supported(next_brick):
            if supported_brick not in marked_bricks:
                other_supports = [
                    b for b in get_supporting(supported_brick) if b not in marked_bricks
                ]
                if len(other_supports) == 0:
                    marked_bricks.append(supported_brick)
                    next_bricks.append(supported_brick)

    return len(marked_bricks) - 1


support_counts = [num_supported(brick) for brick in stable_bricks]

print("Star 1:", sum(1 for c in support_counts if c == 0))

print("Star 2:", sum(support_counts))
