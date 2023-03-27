local inspect = require 'inspect'
local function slurp(path)
  local f = io.open(path)
  local s = f:read("*a")
  f:close()
  return s
end

local rawInput = slurp('day04/input.txt')

for group in rawInput:gmatch('(.+)\n\n') do
  print('------' .. group .. '------\n')
end

local input = {}
