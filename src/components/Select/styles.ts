import styled, { css } from 'styled-components'

import Tooltip from '../Tooltip'

interface ContainerProps {
  isErrored: boolean
  isFocused: boolean
  isFilled: boolean
}

export const Container = styled.div<ContainerProps>`
  padding: 0 10px;
  width: 225px;
  border: 1px solid;
  border-radius: 5px;
  display: flex;
  align-items: center;
  & + div {
    margin-left: 15px;
  }
  & > div {
    flex: 1;
    border: 0;
    width: 100%;
    background: transparent;
  }
  div {
    overflow: visible;
    border: 0;
    padding: 0;
  }

  ${(props) => props.isErrored && css`
    border-color: #c53030;
  `}

  ${(props) => props.isFocused && css`
    border-color: #000000;
  `}

  ${(props) => props.isFilled && css`
    color: #000000;
  `}

`

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;
  svg {
      margin: 0;
    }
  span {
    background: #c53030;
    color: #fff;
    &::before {
      border-color: #c53030 transparent;
    }
  }
`
