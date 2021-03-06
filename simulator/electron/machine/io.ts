import BusInterface from '6502.ts/lib/machine/bus/BusInterface'
import { MultiplexingBus } from './multiplexingBus'

export class IoMultiplexer extends MultiplexingBus {
  constructor(private _ioLineMap: { [key: number]: BusInterface }) {
    super()
  }

  protected override _getBus(address: number): BusInterface | null {
    const ioLine = (address >> 6) & 0xf
    // console.log(`IoLine: ${ioLine}`)
    return this._ioLineMap[ioLine]
  }
}
