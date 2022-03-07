import Debugger from '6502.ts/lib/machine/Debugger'
import { toHex } from '../utils/output'
import { createBoard } from './board'
import { SystemBus } from './systemBus'

const setMemory = (
  bus: SystemBus,
  data: Buffer,
  loadAddress: number,
  entryAddress: number
) => {
  console.log(
    `Loading ${toHex(data.length)} bytes from $${toHex(
      loadAddress
    )} to $${toHex(loadAddress + data.length - 1)}`
  )

  for (let i = 0; i < data.length; i++) {
    bus.poke(loadAddress + i, data[i])
  }

  if (loadAddress + data.length < 0xfffc) {
    console.log(`Setting RESV to $${toHex(entryAddress)}`)

    bus.poke(0xfffc, entryAddress & 0xff)
    bus.poke(0xfffd, (entryAddress >> 8) & 0xff)
  }
}

export const initBoard = (
  loadData: Buffer | null = null,
  loadAdress: number = 0x020,
  entryAddress: number = 0x8000
) => {
  const bus = new SystemBus()
  if (loadData) setMemory(bus, loadData, loadAdress, entryAddress)

  const board = createBoard(bus)
  board.boot()

  const myDebugger = new Debugger()
  myDebugger.attach(board)
  myDebugger.setBreakpointsEnabled(true)

  return {
    board,
    myDebugger,
  }
}
