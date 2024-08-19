import re

instructions = list(open("day-14/input.txt"))


def run(write):
    mask = ""
    memory = {}

    for instruction in instructions:
        if instruction.startswith("mask"):
            mask = instruction[7:-1]

        if instruction.startswith("mem"):
            address, value = (int(v) for v in re.findall(r"\d+", instruction))
            write(memory, mask, address, value)

    return sum(memory.values())


def write1(memory, mask, address, value):
    value_binary = format(value, "036b")
    masked_binary = "".join(m if m != "X" else v for m, v in zip(mask, value_binary))
    memory[address] = int(masked_binary, 2)


print(f"Star 1: {run(write1)}")


def explode_floating(floating_addresses: str):
    if "X" not in floating_addresses:
        yield floating_addresses
    else:
        for b in ("0", "1"):
            yield from explode_floating(floating_addresses.replace("X", b, 1))


def write2(memory, mask, address, value):
    address_binary = format(address, "036b")
    floating_addresses = "".join(
        a if m == "0" else m for m, a in zip(mask, address_binary)
    )
    for address in explode_floating(floating_addresses):
        memory[address] = value


print(f"Star 2: {run(write2)}")
