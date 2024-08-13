import re


passports = [
    {f[0:3]: f[4:] for f in p.split()}
    for p in open("day-04/input.txt").read().strip().split("\n\n")
]


def is_valid(p: dict[str, str]):
    required_fields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]
    return all(f in p for f in required_fields)


print(f"Star 1: {sum(is_valid(p) for p in passports)}")


def is_valid_2(p: dict[str, str]):
    try:
        checks = [
            1920 <= int(p["byr"]) <= 2002,
            2010 <= int(p["iyr"]) <= 2020,
            2020 <= int(p["eyr"]) <= 2030,
            (
                (150 <= int(p["hgt"][:-2]) <= 193)
                if p["hgt"][-2:] == "cm"
                else (
                    (59 <= int(p["hgt"][:-2]) <= 76) if p["hgt"][-2:] == "in" else False
                )
            ),
            bool(re.fullmatch(r"#[0-9a-f]{6}", p["hcl"])),
            p["ecl"] in ("amb", "blu", "brn", "gry", "grn", "hzl", "oth"),
            bool(re.fullmatch(r"[0-9]{9}", p["pid"])),
        ]

        return all(checks)

    except KeyError:
        return False


print(f"Star 2: {sum(is_valid_2(p) for p in passports)}")
