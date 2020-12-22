local input = {}
for line in io.lines('day02/input.txt') do
  local num1, num2, letter, password = line:match('(%d+)%-(%d+) (%a): (%a+)')
  input[#input + 1] = {
    num1 = tonumber(num1),
    num2 = tonumber(num2),
    letter = letter,
    password = password,
  }
end

local function countValid(isValid)
  local count = 0
  for i = 1, #input do
    if isValid(input[i]) then
      count = count + 1
    end
  end
  return count
end

local function isValid1(x)
  local _, count = x.password:gsub(x.letter, '')
  return count >= x.num1 and count <= x.num2
end

print('Day 02A: ' .. countValid(isValid1))

local function isValid2(x)
  local char1 = x.password:sub(x.num1, x.num1)
  local char2 = x.password:sub(x.num2, x.num2)
  return (char1 == x.letter) ~= (char2 == x.letter)
end

print('Day 02B: ' .. countValid(isValid2))
