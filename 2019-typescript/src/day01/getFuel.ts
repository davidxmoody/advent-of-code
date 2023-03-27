export function getFuel(mass: number): number {
  return Math.max(0, Math.floor(mass / 3) - 2)
}

export function getFuelRecursive(mass: number): number {
  const fuel = getFuel(mass)
  return fuel + (fuel > 0 ? getFuelRecursive(fuel) : 0)
}
