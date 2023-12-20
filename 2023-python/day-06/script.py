import re
import numpy


def extract_numbers(text: str):
    return [int(s) for s in re.findall(r"\d+", text)]


def join_numbers(nums: list[int]):
    return int("".join(map(str, nums)))


data = list(open("day-06/input.txt"))

times = extract_numbers(data[0])
records = extract_numbers(data[1])


def get_possible_distances(time: int):
    for t in range(1, time):
        yield t * (time - t)


def get_num_winning_distances(time: int, record: int):
    return len([d for d in get_possible_distances(time) if d > record])


star1answer = numpy.prod(
    [get_num_winning_distances(time, record) for (time, record) in zip(times, records)]
)

print("Star 1:", star1answer)

star2answer = get_num_winning_distances(join_numbers(times), join_numbers(records))

print("Star 2:", star2answer)
