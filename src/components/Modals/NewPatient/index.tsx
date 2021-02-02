import React, { useCallback, useRef } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { isValid } from 'cpf'

import {
  ModalContainer, Container, ContainerHeader, FormContainer,
} from './styles'
import Input from '../../Input'
import Button from '../../Button'
import getValidationErrors from '../../../utils/getValidationErrors'
import api from '../../../services/api'
import { useToast } from '../../../hooks/toast'
import { errorCodes } from '../../../utils/constants'
import { removeMask } from '../../../utils/cpfMask'

interface ModalProps {
  onClose: () => void
  id: string
}

interface FormData {
  name: string
  document: string
}

const NewPatientModal: React.FC<ModalProps> = ({ onClose = () => {}, id = 'modal' }) => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()

  const handleOutsideClick = (e: any) => {
    if (e.target?.id === id) onClose()
  }

  const handleSubmit = useCallback(async (data: FormData) => {
    try {
      formRef.current?.setErrors({})
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome do paciente é obrigatório'),
        document: Yup.string().test('test-document', 'CPF inválido', () => isValid(data.document)).required('CPF é obrigatório'),
      })
      await schema.validate(data, { abortEarly: false })
      await api.post('/patients', { ...data, document: removeMask(data.document) })
      addToast({
        type: 'success',
        title: 'Paciente cadastrado',
        description: 'Paciente cadastrado com sucesso',
      })
      formRef.current?.reset()
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors)
        return
      }
      const errorMessage = errorCodes[err.response.data.code]
      addToast({
        type: 'error',
        title: 'Erro ao cadastrar paciente',
        description: errorMessage || 'Erro ao cadastrar paciente',
      })
    }
  }, [addToast])

  return (
    <ModalContainer id={id} onClick={(e) => handleOutsideClick(e)}>
      <Container>
        <ContainerHeader>
          <h2>Novo Paciente</h2>
          <button type="button" onClick={onClose}>x</button>
        </ContainerHeader>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input name="name" placeholder="Nome" />
            <Input name="document" isCpf placeholder="CPF" />
            <Button type="submit">Cadastrar</Button>
          </Form>
        </FormContainer>
      </Container>
    </ModalContainer>
  )
}

export default NewPatientModal
