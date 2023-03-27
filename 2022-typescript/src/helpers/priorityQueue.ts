export class PriorityQueue<T> {
  private getKey: (item: T) => string
  private getPriority: (item: T) => number
  private items: Array<{key: string; priority: number; item: T}> = []
  private keys: Record<string, boolean> = {}

  constructor(
    getKey: (item: T) => string,
    getPriority: (item: T) => number,
    initialItems?: T[],
  ) {
    this.getKey = getKey
    this.getPriority = getPriority
    if (initialItems) this.add(initialItems)
  }

  add(items: T[]) {
    for (const item of items) {
      const key = this.getKey(item)
      if (this.keys[key]) continue

      const priority = this.getPriority(item)
      const insertionIndex = this.items.findIndex((q) => q.priority > priority)

      this.items.splice(
        insertionIndex === -1 ? this.items.length : insertionIndex,
        0,
        {key, priority, item},
      )
      this.keys[key] = true
    }
  }

  shift() {
    const result = this.items.shift()
    if (result) delete this.keys[result.key]
    return result?.item
  }

  get length() {
    return this.items.length
  }
}
