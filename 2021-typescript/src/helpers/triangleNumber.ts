const triangleNumberCache: Record<number, number> = []

export default function triangleNumber(num: number): number {
  if (num === 0) return 0

  if (triangleNumberCache[num]) return triangleNumberCache[num]

  const result = num + triangleNumber(num - 1)
  triangleNumberCache[num] = result
  return result
}
