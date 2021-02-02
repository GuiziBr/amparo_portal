import styled from 'styled-components'

export const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid;
  padding: 20px 0;
  h1 {
    padding-left: 25px;
    padding-right: 25px;
    font-size: 20px;
    color: #3a3a3a;
  }
`
export const ContainerPageHeader = styled.section`
  padding: 15px 0;
  border-top: 1px solid;
  border-bottom: 1px solid;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #C0C0C0;
  border-bottom: 1px solid;
`

export const ContainerActivities = styled.div`
  padding-left: 25px;
  padding-right: 25px;
  h2 {
    font-size: 22px;
  }
`

export const ContainerRegister = styled.div`
  padding: 0 25px;
`

export const FormContainer = styled.div`
  width: 100%;
  border-bottom: 1px solid;
  padding: 15px 55px;
  form {
    display: flex;
    justify-content: center;
  }
`

export const TableContainer = styled.section`
  margin-top: 30px;
  padding: 0 25px;
  table {
    width: 100%;
    border-collapse: collapse;
    th {
      color: #969cb3;
      font-weight: normal;
      padding: 10px 32px;
      text-align: left;
      font-size: 20px;
      line-height: 24px;
    }
    tr {
      border-bottom: 1px solid;
    }
    td {
      padding: 10px 32px;
      background: #fff;
      font-size: 16px;
      font-weight: normal;
      color: #969cb3;
    }
  }
`
