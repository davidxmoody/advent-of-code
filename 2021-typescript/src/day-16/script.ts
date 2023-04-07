import readLines from "../helpers/readLines"

type Packet =
  | {length: number; version: number; packetType: 4; value: number}
  | {length: number; version: number; packetType: number; subPackets: Packet[]}

function sumLengths(packets: Packet[]) {
  return packets.reduce((acc, packet) => acc + packet.length, 0)
}

const input = readLines(__dirname + "/input.txt")[0]
  .split("")
  .map((char) => parseInt(char, 16).toString(2).padStart(4, "0"))
  .join("")

function parsePacket(start: number): Packet {
  const version = parseInt(input.slice(start, start + 3), 2)
  const packetType = parseInt(input.slice(start + 3, start + 6), 2)

  if (packetType === 4) {
    let value = ""
    for (let position = start + 6; true; position += 5) {
      value += input.slice(position + 1, position + 5)
      if (input[position] !== "1") {
        return {
          version,
          packetType,
          value: parseInt(value, 2),
          length: position + 5 - start,
        }
      }
    }
  }

  const subPackets: Packet[] = []
  const lengthType = input[start + 6]

  if (lengthType === "0") {
    const numBits = parseInt(input.slice(start + 7, start + 7 + 15), 2)
    while (sumLengths(subPackets) < numBits) {
      subPackets.push(parsePacket(start + 7 + 15 + sumLengths(subPackets)))
    }
  } else {
    const numPackets = parseInt(input.slice(start + 7, start + 7 + 11), 2)
    while (subPackets.length < numPackets) {
      subPackets.push(parsePacket(start + 7 + 11 + sumLengths(subPackets)))
    }
  }

  const length = 7 + (lengthType === "0" ? 15 : 11) + sumLengths(subPackets)

  return {length, version, packetType, subPackets}
}

function sumVersionNumbers(packet: Packet) {
  let total = packet.version
  if ("subPackets" in packet) {
    for (const subPacket of packet.subPackets) {
      total += sumVersionNumbers(subPacket)
    }
  }
  return total
}

const topPacket = parsePacket(0)

console.log("Star 1:", sumVersionNumbers(topPacket))

function evaluate(packet: Packet): number {
  const subValues =
    "subPackets" in packet ? packet.subPackets.map(evaluate) : []

  switch (packet.packetType) {
    case 0:
      return subValues.reduce((a, b) => a + b, 0)

    case 1:
      return subValues.reduce((a, b) => a * b, 1)

    case 2:
      return Math.min(...subValues)

    case 3:
      return Math.max(...subValues)

    case 4:
      return "value" in packet ? packet.value : NaN

    case 5:
      return subValues[0] > subValues[1] ? 1 : 0

    case 6:
      return subValues[0] < subValues[1] ? 1 : 0

    case 7:
      return subValues[0] === subValues[1] ? 1 : 0

    default:
      throw new Error("Invalid packet type")
  }
}

console.log("Star 2:", evaluate(topPacket))
