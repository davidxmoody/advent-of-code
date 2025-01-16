from collections import Counter


list1 = []
list2 = []

for line in open("day-01/input.txt"):
    num1, num2 = line.strip().split()
    list1.append(int(num1))
    list2.append(int(num2))

distance = sum(abs(a - b) for a, b in zip(sorted(list1), sorted(list2)))

print(f"Star 1: {distance}")

counter = Counter(list2)
similarity = sum(a * counter[a] for a in list1)

print(f"Star 2: {similarity}")
