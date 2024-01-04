from queue import PriorityQueue
from typing import Literal, NamedTuple

data = [[int(i) for i in row[:-1]] for row in open("day-17/input.txt")]

Axis = Literal[0, 1]


class Point(NamedTuple):
    y: int
    x: int


class Node(NamedTuple):
    priority: int
    pos: Point
    axis: Axis
    cost: int


def heuristic(p: Point):
    return len(data) - 1 - p.y + len(data[0]) - 1 - p.x


def is_destination(p: Point):
    return p.y == len(data) - 1 and p.x == len(data[0]) - 1


def in_bounds(p: Point):
    return 0 <= p.y < len(data) and 0 <= p.x < len(data[0])


def get_costs(start_exc: Point, end_inc: Point):
    cost = 0
    if start_exc[0] == end_inc[0]:
        step = 1 if start_exc[1] > end_inc[1] else -1
        for x in range(end_inc[1], start_exc[1], step):
            cost += data[start_exc.y][x]
    elif start_exc[1] == end_inc[1]:
        step = 1 if start_exc[0] > end_inc[0] else -1
        for y in range(end_inc[0], start_exc[0], step):
            cost += data[y][start_exc.x]
    return cost


def steps(p: Point, axis: Axis, ultra: bool):
    allowed_range = list(range(4, 11) if ultra else range(1, 4))
    allowed_range += [-i for i in allowed_range]

    for di in allowed_range:
        p2 = Point(p.y + di, p.x) if axis == 0 else Point(p.y, p.x + di)
        if in_bounds(p2):
            yield (p2, get_costs(p, p2))


def get_next(node: Node, ultra: bool):
    next_axis = 1 if node.axis == 0 else 0
    for p, step_cost in steps(node.pos, next_axis, ultra):
        yield Node(
            node.cost + step_cost + heuristic(p),
            p,
            next_axis,
            node.cost + step_cost,
        )


def find_path_cost(ultra=False):
    visited = [[[False, False] for _ in row] for row in data]

    open_nodes: PriorityQueue[Node] = PriorityQueue()
    open_nodes.put(Node(0, Point(0, 0), 0, 0))
    open_nodes.put(Node(0, Point(0, 0), 1, 0))

    while not open_nodes.empty():
        node = open_nodes.get()

        if is_destination(node.pos):
            return node.cost

        if visited[node.pos.y][node.pos.x][node.axis]:
            continue

        visited[node.pos.y][node.pos.x][node.axis] = True

        for next_node in get_next(node, ultra):
            if not visited[next_node.pos.y][next_node.pos.x][next_node.axis]:
                open_nodes.put(next_node)


print("Star 1:", find_path_cost())

print("Star 2:", find_path_cost(ultra=True))
