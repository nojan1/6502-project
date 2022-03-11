import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { toHex } from '../../../electron/utils/output'
import { useMachineContext } from '../../context/machine'
import { BorderColor } from '../../styles'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeGrid as Grid, GridChildComponentProps } from 'react-window'
import Modal from '../Modal'

const chunkSize = 16

export interface MemoryExplorerProps {
  selectedAddress?: { value: number }
}

const MemoryExplorerContainer = styled.div`
  max-width: 700px;
  max-height: 90vh;
  min-width: 500px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
`

const MemoryContentsContainer = styled.div`
  margin-top: 10px;
  flex-grow: 1;
  user-select: none;
`

const MemoryAddessInput = styled.div`
  position: relative;

  span {
    position: absolute;
    left: 10px;
    top: 4px;
  }

  input {
    padding: 5px 10px 5px 19px;
    background-color: transparent;
    color: white;
    border-color: ${BorderColor};
    outline-color: white;
    outline-width: 0.5px;
    width: 100%;
  }
`

const MemoryExplorer: React.FunctionComponent<MemoryExplorerProps> = ({
  selectedAddress,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    setIsOpen(selectedAddress !== undefined)
  }, [selectedAddress])

  const handleOnScroll = (toAddress: number) => {
    gridRef.current?.scrollToItem({
      align: 'smart',
      columnIndex: 0,
      rowIndex: toAddress / chunkSize,
    })
  }

  const gridRef = React.createRef<Grid<any>>()
  const numRows = 0x10000 / chunkSize
  const numColumns = 1 + chunkSize
  const cell = (props: GridChildComponentProps<any>) => (
    <MemoryGridCell {...props} />
  )

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <MemoryExplorerContainer>
        <MemoryAddessInput>
          <span>$</span>
          <input
            defaultValue={toHex(selectedAddress?.value ?? 0, 4, false)}
            pattern="[0-9a-fA-F]*"
            onChange={e => handleOnScroll(parseInt(e.target.value, 16))}
          />
        </MemoryAddessInput>

        <MemoryContentsContainer>
          <AutoSizer>
            {({ width, height }) => (
              <Grid
                ref={gridRef}
                columnCount={numColumns}
                rowCount={numRows}
                width={width}
                height={height}
                columnWidth={index => (index === 0 ? 60 : 25)}
                rowHeight={_ => 15}
              >
                {cell}
              </Grid>
            )}
          </AutoSizer>
        </MemoryContentsContainer>
      </MemoryExplorerContainer>
    </Modal>
  )
}

const MemoryGridCell: React.FunctionComponent<GridChildComponentProps<any>> = ({
  rowIndex,
  columnIndex,
  style,
}) => {
  const { memoryDump } = useMachineContext()

  const value =
    columnIndex === 0
      ? rowIndex * chunkSize + columnIndex
      : memoryDump?.[rowIndex * chunkSize + columnIndex] ?? 0

  const numDigits = columnIndex === 0 ? 4 : 2
  const displayPrefix = columnIndex === 0

  return <div style={style}>{toHex(value, numDigits, displayPrefix)}</div>
}

export default MemoryExplorer
