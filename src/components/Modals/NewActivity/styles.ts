import styled from 'styled-components'

export const ModalContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 50;
  left: 50;
  z-index: 10;
  background-color: #000;
  opacity: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Container = styled.div`
  width: 40%;
  max-width: 477px;
  height: 35%;
  background: #fff;
  color: #000;
  border-style: solid;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
`
export const ContainerHeader = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 15px 10px;
`

export const FormContainer = styled.div`
  form {
    width: 100%;
    padding: 15px 10px;
    display: flex;
    flex-direction: column;
    textarea {
      padding-top: 10px;
      height: 65px;
    }
    button {
      margin-left: 0;
    }
  }
`

export const SearchPatient = styled.div`
  margin-bottom: 15px;
  div {
    width: 100%;
    height: 38px;
  }

`
export const Schedule = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;
`
