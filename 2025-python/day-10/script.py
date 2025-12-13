import re
from typing import cast
import pulp
from itertools import combinations


class Machine:
    def __init__(self, line: str):
        m = re.match(r"\[(.*)\] (.*) \{(.*)\}", line)
        if m is None:
            raise Exception("Invalid input")
        lights, switches, joltages = m.groups()

        self.lights = [c == "#" for c in lights]
        self.switches = [
            [int(n) for n in switch[1:-1].split(",")] for switch in switches.split(" ")
        ]
        self.joltages = [int(n) for n in joltages.split(",")]

    def turns_on(self, switches):
        lights = [False for _ in self.lights]
        for switch in switches:
            for i in switch:
                lights[i] = not lights[i]
        return lights == self.lights

    def find_minimal_presses(self):
        for presses in range(1, len(self.switches) + 1):
            for switch_combo in combinations(self.switches, presses):
                if self.turns_on(switch_combo):
                    return presses
        raise Exception("No solution")

    def solve_joltage(self):
        A = [
            [int(i in switch) for switch in self.switches]
            for i in range(len(self.joltages))
        ]
        b = self.joltages

        prob = pulp.LpProblem("MinimizeSum", pulp.LpMinimize)

        x = [
            pulp.LpVariable(f"x{i}", lowBound=0, cat="Integer")
            for i in range(len(A[0]))
        ]

        prob += pulp.lpSum(x)

        for row, rhs in zip(A, b):
            prob += pulp.lpDot(row, x) == rhs

        prob.solve()

        solution = cast(float, pulp.value(prob.objective))

        return int(solution)


machines = [Machine(line) for line in open("day-10/input.txt").read().splitlines()]

print(f"Star 1: {sum(m.find_minimal_presses() for m in machines)}")

print(f"Star 2: {sum(m.solve_joltage() for m in machines)}")
