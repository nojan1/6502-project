import React, { useState } from 'react'
import styled from 'styled-components'

const DisplayOuter = styled.div`
  display: flex;
  border: 1px solid #b8b8b82b;
  background-color: #0f0f0f;
  padding: 20px;
`

const DisplayInner = styled.div`
  flex-grow: 1;
  background-color: #003805;
  display: grid;
  grid-template-columns: repeat(20, auto);
  grid-template-rows: repeat(2, auto);
  padding: 5px;
`

const Digit = styled.div`
  font-family: monospace;
  background-color: #005f18;
  color: black;
  font-weight: bold;
  font-size: 24px;
  width: 24px;
  height: 24px;
  line-height: 24px;
  vertical-align: center;
  text-align: center;
  margin: 2px;
`

const LcdDisplay: React.FunctionComponent = () => {
  const [text, setText] = useState('')

  return (
    <DisplayOuter>
      <DisplayInner>
        {Array.from(text.padEnd(40, ' ')).map((c, i) => (
          <Digit key={i}>{c}</Digit>
        ))}
      </DisplayInner>
    </DisplayOuter>
  )
}

export default LcdDisplay