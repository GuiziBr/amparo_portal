import styled from 'styled-components'
import { shade } from 'polished'

export const Container = styled.button`
  width: 170px;
  height: 40px;
  border: 1px solid;
  border-radius: 5px;
  background-color: #32CD32;
  transition: background-color 0.2s;
  margin-left: 15px;
  &:hover {
    background: ${shade(0.2, '#32CD32')};
  }
  & + button {
    margin-left: 15px;
  }
`
