from numpy import array
from typing import NamedTuple


class Point(NamedTuple):
    y: int
    x: int


data = array([[c for c in line[:-1]] for line in open("day-23/input.txt")])

start = Point(0, list(data[0]).index("."))
goal = Point(len(data) - 1, list(data[-1]).index("."))


all_directions = [">", "v", "<", "^"]


def reverse_direction(d: str):
    return all_directions[(all_directions.index(d) + 2) % 4]


def in_bounds(p: Point):
    return p.y >= 0 and p.y < len(data) and p.x >= 0 and p.x < len(data[0])


def step(p: Point, d: str):
    match d:
        case ">":
            return Point(p.y, p.x + 1)
        case "v":
            return Point(p.y + 1, p.x)
        case "<":
            return Point(p.y, p.x - 1)
        case "^":
            return Point(p.y - 1, p.x)
    raise Exception("Unknown direction")


def is_valid_step(p: Point, d: str, slopes: bool):
    return in_bounds(p) and (data[p] in (".", d) if slopes else data[p] != "#")


def get_next_node(p: Point, d: str, slopes: bool):
    distance = 0
    while True:
        distance += 1
        p = step(p, d)

        if not is_valid_step(p, d, slopes):
            return None

        if p == goal:
            return (p, distance)

        connected = []

        for next_d in all_directions:
            if next_d != reverse_direction(d):
                next_p = step(p, next_d)
                if is_valid_step(next_p, next_d, slopes):
                    connected.append(next_d)

        if len(connected) >= 2:
            return (p, distance)
        elif len(connected) == 0:
            return None
        else:
            d = connected[0]


def get_connected_nodes(p: Point, slopes: bool):
    for d in all_directions:
        node = get_next_node(p, d, slopes)
        if node is not None:
            yield node


def build_graph(slopes: bool):
    graph = {}
    unexplored = {start}

    while len(unexplored):
        node = unexplored.pop()
        graph[node] = list(get_connected_nodes(node, slopes))
        for connected, _ in graph[node]:
            if connected not in graph:
                unexplored.add(connected)

    return graph


def routes(graph, path=[start], distance=0):
    if path[-1] == goal:
        yield distance
    else:
        for connected, dist in graph[path[-1]]:
            if connected not in path:
                yield from routes(graph, [*path, connected], distance + dist)


print("Star 1:", max(routes(build_graph(slopes=True))))

print("Star 2:", max(routes(build_graph(slopes=False))))
