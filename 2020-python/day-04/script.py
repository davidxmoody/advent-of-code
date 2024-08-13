passports = open("day-04/input.txt").read().strip().split("\n\n")

required_fields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]


def is_valid(passport: str):
    field_names = {p[0:3] for p in passport.split()}
    return all(f in field_names for f in required_fields)


print(f"Star 1: {sum(is_valid(p) for p in passports)}")
