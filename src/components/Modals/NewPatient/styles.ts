import styled from 'styled-components'

export const ModalContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 50;
  left: 50;
  z-index: 10;
  background-color: #000000;
  opacity: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Container = styled.div`
  width: 60%;
  max-width: 732px;
  height: 16%;
  background-color: #fff;
  color: #000;
  border-style: solid;
  padding: 10px;
  border-radius: 10px;
`

export const ContainerHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 15px 10px;
`

export const FormContainer = styled.div`
  width: 100%;
  form {
    padding: 15px 10px;
    display: flex;
    justify-content: space-between;
  }
`
