local input = {}
for line in io.lines('day03/input.txt') do
  input[#input + 1] = line
end

local function hits(dx, dy)
  local x, y = 1, 1
  local count = 0
  while y <= #input do
    local wrappedX = (x - 1) % #input[y] + 1
    if input[y]:sub(wrappedX, wrappedX) == '#' then
      count = count + 1
    end
    x = x + dx
    y = y + dy
  end
  return count
end

print('Day 03A: ' .. hits(3, 1))

print('Day 03B: ' .. (hits(1, 1) * hits(3, 1) * hits(5, 1) * hits(7, 1) * hits(1, 2)))
