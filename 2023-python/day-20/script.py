from numpy import prod


broadcaster: list[str] = []
modules: dict[str, tuple[str, list[str]]] = {}

for line in open("day-20/input.txt"):
    (before, after) = line[:-1].split(" -> ")
    outputs = after.split(", ")
    if before == "broadcaster":
        broadcaster = outputs
    else:
        module_type = before[0]
        label = before[1:]
        modules[label] = (module_type, outputs)


def find_inputs(label: str):
    return [l for l, (_, o) in modules.items() if label in o]


flip_flop_state: dict[str, bool] = {}
conjunction_state: dict[str, dict[str, bool]] = {}


for label, (module_type, outputs) in modules.items():
    if module_type == "%":
        flip_flop_state[label] = False
    elif module_type == "&":
        conjunction_state[label] = {l: False for l in find_inputs(label)}


pulse_counts = [0, 0]

cycle_lengths = {label: 0 for label in find_inputs(find_inputs("rx")[0])}

for i in range(1, 4000):
    pulse_counts[False] += 1

    signals: list[tuple[str, str, bool]] = [
        ("broadcaster", label, False) for label in broadcaster
    ]

    while len(signals):
        (from_label, to_label, is_high) = signals.pop(0)

        if to_label in cycle_lengths and not is_high:
            cycle_lengths[to_label] = i

        pulse_counts[is_high] += 1

        if to_label in modules:
            if modules[to_label][0] == "%":
                if not is_high:
                    next_value = not flip_flop_state[to_label]
                    flip_flop_state[to_label] = next_value
                    for output in modules[to_label][1]:
                        signals.append((to_label, output, next_value))

            else:
                conjunction_state[to_label][from_label] = is_high
                next_value = not all(conjunction_state[to_label].values())
                for output in modules[to_label][1]:
                    signals.append((to_label, output, next_value))

    if i == 1000:
        print("Star 1:", pulse_counts[0] * pulse_counts[1])

print("Star 2:", prod(list(cycle_lengths.values())))
