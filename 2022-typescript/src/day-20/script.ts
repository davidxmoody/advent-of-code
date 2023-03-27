import readLines from "../helpers/readLines"

const rawNumbers = readLines(__dirname + "/input.txt").map((line) =>
  parseInt(line, 10),
)

type ListItem = {value: number; left: ListItem; right: ListItem}

function buildLinkedList(multiplier = 1) {
  return rawNumbers
    .map((value) => ({value: value * multiplier} as ListItem))
    .map((item, index, list) => {
      const prevIndex = (list.length + index - 1) % list.length
      const nextIndex = (index + 1) % list.length
      item.left = list[prevIndex]
      item.right = list[nextIndex]
      return item
    })
}

function mix(linkedList: ListItem[]) {
  for (const listItem of linkedList) {
    let currentLeft = listItem.left
    let currentRight = listItem.right

    currentLeft.right = currentRight
    currentRight.left = currentLeft

    const moves = listItem.value % (linkedList.length - 1)

    if (moves > 0) {
      for (let i = 0; i < moves; i++) {
        currentLeft = currentRight
        currentRight = currentRight.right
      }
    }

    if (moves < 0) {
      for (let i = 0; i > moves; i--) {
        currentRight = currentLeft
        currentLeft = currentLeft.left
      }
    }

    currentRight.left = listItem
    currentLeft.right = listItem
    listItem.left = currentLeft
    listItem.right = currentRight
  }
}

function getGroveCoordinates(linkedList: ListItem[]) {
  let groveCoordinates = 0
  let current = linkedList.find((x) => x.value === 0)!

  for (let i = 1; i <= 3000; i++) {
    current = current.right
    if (i % 1000 === 0) groveCoordinates += current.value
  }

  return groveCoordinates
}

const linkedList = buildLinkedList()
mix(linkedList)
console.log("Star 1:", getGroveCoordinates(linkedList))

const multipliedLinkedList = buildLinkedList(811589153)
for (let i = 0; i < 10; i++) {
  mix(multipliedLinkedList)
}
console.log("Star 2:", getGroveCoordinates(multipliedLinkedList))
