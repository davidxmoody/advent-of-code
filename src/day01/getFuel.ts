export function getFuel(mass: number): number {
  return Math.max(0, Math.floor(mass / 3) - 2)
}
