from itertools import pairwise


graph = {line[0:3]: set(line[5:-1].split(" ")) for line in open("day-25/input.txt")}


def get_edge(a: str, b: str):
    return (min(a, b), max(a, b))


all_edges = set()

for component, links in list(graph.items()):
    for link in links:
        all_edges.add(get_edge(component, link))
        if link in graph:
            graph[link].add(component)
        else:
            graph[link] = set([component])


def find_path(start: str, end: str, exclusions: list[tuple[str, str]]):
    initial_path = [start]
    paths = [initial_path]

    while len(paths):
        path = paths.pop(0)
        current = path[-1]

        possible_next_nodes = [
            node
            for node in graph[current]
            if node not in path and get_edge(current, node) not in exclusions
        ]

        for next_node in possible_next_nodes:
            next_path = [*path, next_node]
            if next_node == end:
                return [get_edge(a, b) for a, b in pairwise(next_path)]
            else:
                paths.append(next_path)
                if len(next_path) > 12:
                    return None

    return None


def has_enough_backup_paths(edge: tuple[str, str]):
    exclusions = [edge]
    for _ in range(3):
        path = find_path(edge[0], edge[1], exclusions)
        if path is None:
            return False
        exclusions.extend(path)
    return True


edges_to_cut = [edge for edge in all_edges if not has_enough_backup_paths(edge)]

left = set()
unchecked = set([list(graph.keys())[0]])

while len(unchecked):
    item = unchecked.pop()
    left.add(item)
    for connected in graph[item]:
        if connected not in left and get_edge(item, connected) not in edges_to_cut:
            unchecked.add(connected)

print("Star 1:", len(left) * (len(graph) - len(left)))
