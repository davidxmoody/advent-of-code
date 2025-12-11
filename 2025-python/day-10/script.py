import re
import numpy as np
from math import ceil
from scipy.optimize import linprog
from itertools import combinations

def all_nonneg_ints(arr: np.ndarray) -> bool:
    # Check integer-valued: x == floor(x)
    is_int = np.equal(arr, arr.astype(int))
    # Check non-negative
    is_nonneg = arr >= 0
    return np.all(is_int & is_nonneg)


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
        switches = np.zeros((len(self.joltages), len(self.switches)))
        for switch_index, switch_outputs in enumerate(self.switches):
            for output in switch_outputs:
                switches[output, switch_index] = 1

        joltages = np.array(self.joltages)

        # presses = np.linalg.solve(switches, joltages)

        c = np.ones(switches.shape[1])

        presses = linprog(
            c, A_eq=switches, b_eq=joltages, bounds=[(0, None)] * switches.shape[1]
        ).x

        # if not all_nonneg_ints(presses):
        print(self.switches)
        print(self.joltages)
        print(switches)
        print(joltages)
        print(presses)
        print(presses.sum())

        return int(ceil(presses.sum()))


machines = [Machine(line) for line in open("day-10/input.txt").read().splitlines()]

total_presses = sum(m.find_minimal_presses() for m in machines)

print(f"Star 1: {total_presses}")

# for m in machines:
#     print(m.solve_joltage())

# [1, 3, 0, 3, 1, 2]

# [0, -1, 0, +1, -1, + 1]

print(f"Star 2: {sum(m.solve_joltage() for m in machines)}")

# 21421 too low
# 21449 too low

# line = "[#...#] (1,3) (2,3,4) (0,2,3) (0,1,2) (2,3) {37,24,60,50,16}"

# c + d = 37
# a + d = 24
# b + c + d + e = 60
# a + b + c + e = 50
# b = 16

# c + d = 37
# a + d = 24
# c + d + e = 60 - 16
# a + c + e = 50 - 16

# d - c - e = 24 - 50 + 16
# c + d = 37
# c + d + e = 60 - 16

# 2d = 60 - 50 + 24
# c + d = 37


# d = 17
# c + d = 37


# a = 7
# b = 16
# c = 20
# d = 17
# e = 7


# 67

# A = np.array(
#     [
#         [0, 0, 1, 1, 0],
#         [1, 0, 0, 1, 0],
#         [0, 1, 1, 1, 1],
#         [1, 1, 1, 0, 1],
#         [0, 1, 0, 0, 0],
#     ]
# )

# b = np.array([37, 24, 60, 50, 16])

# x = np.linalg.solve(A, b)

# A = np.array([
#     [1, 1, 0, 0, 1, 0, 0,],
#     [1, 1, 0, 0, 0, 1, 0,],
#     [0, 0, 0, 0, 0, 1, 0,],
#     [1, 0, 0, 0, 0, 0, 1,],
#     [0, 0, 1, 0, 1, 0, 0,],
#     [1, 1, 0, 1, 0, 1, 0,],
#     [1, 0, 0, 1, 0, 0, 0,],
#     [0, 0, 0, 0, 1, 0, 0,],
# ])
# b = np.array([23,18,2,26,14,36,25,7])

# # Objective: minimize sum of variables
# c = np.ones(A.shape[1])   # [1, 1, 1, 1, 1]

# # Solve LP: minimize cᵀx  subject to A x = b, x >= 0
# res = linprog(c, A_eq=A, b_eq=b, bounds=[(0, None)] * A.shape[1])
# res.x



# [.###.] a(0,2,3) b(0,1,3) c(1,3,4) d(0,1,4) e(0,1,2,4) f(0,3) g(0,3,4) {64,44,14,46,51}

# a b d e f g = 64
# b c d e = 44
# a e == 14
# a b c f g = 46
# c d e g = 51


# b d e = 64 - a - f - g
# b d e = 44 - c
# a f g - c = 20


# c d e = 44 - b
# c d e = 51 - g
# 44 - b = 51 - g
# g - b = 7
# g = b + 7


# a b d e f g = 64
# a e == 14
# b d f g = 50


# [.###.] a(0,2,3) b(0,1,3) c(1,3,4) d(0,1,4) e(0,1,2,4) f(0,3) g(0,3,4) {64,44,14,46,51}

# {1,1,0,1,1}


# a b   d e f g = 64
#   b c d e     = 44
# a       e     = 14
# a b c     f g = 46
#     c d e   g = 51

# A 1101111 = 64
# B 0111100 = 44
# C 1000100 = 14
# D 1110011 = 46
# E 0011101 = 51

# A + C + D = 1
# A + B + D = 1
# B + D + E = 1
# A + B + E = 1
# A + B + C + E = 1
# A + D = 1
# A + D + E = 1

# E = 0

# A + C + D = 1
# A + B + D = 1
# B + D = 1
# A + B = 1
# A + B + C = 1
# A + D = 1

# C = 0

# A + B + D = 1
# B + D = 1
# A + B = 1
# A + D = 1





# sum = 64 + c
# need to find c
# can c just be zero?

# e = 14 - a
# -a b c d = 30
# a b c f g = 46
# -a c d g = 37

# c = a - b - d + 30
# c = - a - b - f - g + 46
# c = a - d - g + 37




# line = "[#...#] (1,3) (2,3,4) (0,2,3) (0,1,2) (2,3) {37,24,60,50,16}"

# c + d = 37
# a + d = 24
# b + c + d + e = 60
# a + b + c + e = 50
# b = 16

# a b c d e



# a = 7
# b = 16
# c = 20
# d = 17
# e = 7


# 67
