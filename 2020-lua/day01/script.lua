local input = {}
for line in io.lines('day01/input.txt') do
  input[#input + 1] = tonumber(line)
end

local function day01A()
  for i = 1, #input - 1 do
    for j = i + 1, #input do
      if input[i] + input[j] == 2020 then
        return input[i] * input[j]
      end
    end
  end
end

print('Day 01A: ' .. day01A())

local function day01B()
  for i = 1, #input - 2 do
    for j = i + 1, #input - 1 do
      for k = j + 1, #input do
        if input[i] + input[j] + input[k] == 2020 then
          return input[i] * input[j] * input[k]
        end
      end
    end
  end
end

print('Day 01B: ' .. day01B())
