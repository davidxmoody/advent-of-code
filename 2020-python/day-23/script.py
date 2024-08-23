from __future__ import annotations
from dataclasses import dataclass


@dataclass
class Cup:
    value: int
    _next: Cup | None

    @property
    def next(self):
        if self._next is None:
            raise Exception("Next is None")
        return self._next

    @next.setter
    def next(self, new_next: Cup):
        self._next = new_next


@dataclass
class Circle:
    current_cup: Cup
    max_value: int
    cups: dict[int, Cup]

    def __init__(self, cup_list: list[int]):
        self.max_value = max(cup_list)
        self.cups = {}

        last_cup = Cup(cup_list[-1], None)
        self.cups[cup_list[-1]] = last_cup

        prev_cup = last_cup
        for cup_num in cup_list[-2::-1]:
            prev_cup = Cup(cup_num, prev_cup)
            self.cups[prev_cup.value] = prev_cup

        self.current_cup = prev_cup
        last_cup.next = self.current_cup

    def simulate(self, moves: int):
        for _ in range(moves):
            cut_start = self.current_cup.next
            cut_middle = cut_start.next
            cut_end = cut_middle.next
            after_cut = cut_end.next

            self.current_cup.next = after_cut

            cut_values = {cut_start.value, cut_middle.value, cut_end.value}

            dest_value = self.current_cup.value - 1
            while dest_value < 1 or dest_value in cut_values:
                dest_value = self.max_value if dest_value < 1 else dest_value - 1

            dest_cup = self.cups[dest_value]
            cut_end.next = dest_cup.next
            dest_cup.next = cut_start

            self.current_cup = self.current_cup.next


initial_cups = [int(n) for n in open("day-23/input.txt").read().strip()]


circle1 = Circle(initial_cups)
circle1.simulate(100)

star1 = ""
cup = circle1.cups[1].next
while cup.value != 1:
    star1 += str(cup.value)
    cup = cup.next

print(f"Star 1: {star1}")


circle2 = Circle(initial_cups + list(range(10, 1000001)))
circle2.simulate(10000000)
star2 = circle2.cups[1].next.value * circle2.cups[1].next.next.value

print(f"Star 2: {star2}")
