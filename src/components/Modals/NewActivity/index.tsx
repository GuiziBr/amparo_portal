import React, { useCallback, useRef, useState } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { isValid } from 'cpf'
import { startOfDay, format } from 'date-fns'

import {
  ModalContainer, Container, FormContainer, ContainerHeader, SearchPatient, Schedule,
} from './styles'
import Input from '../../Input'
import TextArea from '../../TextArea'
import Select from '../../Select'
import Button from '../../Button'
import { useToast } from '../../../hooks/toast'
import getValidationErrors from '../../../utils/getValidationErrors'
import api from '../../../services/api'
import { errorCodes } from '../../../utils/constants'
import { removeMask } from '../../../utils/cpfMask'

interface ModalProps {
  onClose: () => void
  id: string
}

interface FormData {
  patient: string
  schedule: string
  status: string
  description: string
}

const options = [
  { value: 'open', label: 'Aberto' },
  { value: 'delayed', label: 'Atrasado' },
  { value: 'closed', label: 'Finalizado' },
]

const NewActivityModal: React.FC<ModalProps> = ({ onClose = () => {}, id = 'modal' }) => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const [isValidDocument, seIsValidDocument] = useState<boolean | null>(null)

  const handleOutsideClick = (e: any) => {
    if (e.target?.id === id) onClose()
  }

  const dateMin = format(startOfDay(new Date()), 'yyyy-MM-dd')

  const handleSearchPatient = useCallback(async (e: React.FormEvent<HTMLInputElement>) => {
    try {
      formRef.current?.setErrors({})
      if (e.currentTarget.value.length < 14) return
      const unformattedDocument = removeMask(e.currentTarget.value)
      const schema = Yup.object().shape({
        patient: Yup.string().required().test('test-document', 'CPF inválido', () => isValid(unformattedDocument)),
      })
      await schema.validate({ patient: unformattedDocument })
      const { data } = await api.get(`/patients/${unformattedDocument}`)
      if (data.id) seIsValidDocument(true)
      else {
        seIsValidDocument(false)
        addToast({
          type: 'error',
          title: 'Paciente não encontrado',
          description: 'Paciente não encontrado',
        })
        formRef.current?.reset()
      }
    } catch {
      seIsValidDocument(false)
      addToast({
        type: 'error',
        title: 'Paciente não encontrado',
        description: 'Paciente não encontrado',
      })
    }
  }, [addToast])

  const handleSubmit = useCallback(async (data: FormData) => {
    try {
      formRef.current?.setErrors({})
      const schema = Yup.object().shape({
        patient: Yup.string().required('CPF é obrigatório').test('test-document', 'CPF inválido', () => isValid(data.patient)),
        schedule: Yup.string().required('Data é obrigatória'),
        status: Yup.string().required('Status é obrigatório'),
        description: Yup.string().required('Descrição da atividade é obrigatória'),
      })
      const selectedStatus = options.find((option) => option.label === data.status)
      await schema.validate(data, { abortEarly: false })
      await api.post('/activities', { ...data, status: selectedStatus?.value })
      addToast({
        type: 'success',
        title: 'Atividade cadastrada',
        description: 'Atividade cadastrada com sucesso',
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
        title: 'Erro ao cadastrar atividade',
        description: errorMessage || 'Erro ao cadastrar atividade',
      })
    }
  }, [addToast])

  return (
    <ModalContainer id={id} onClick={handleOutsideClick}>
      <Container>
        <ContainerHeader>
          <h2>Nova Atividade</h2>
          <button type="button" onClick={onClose}>x</button>
        </ContainerHeader>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <SearchPatient>
              <Input
                name="patient"
                placeholder="Busque o paciente por cpf"
                isCpf
                onBlur={(e) => handleSearchPatient(e)}
              />
            </SearchPatient>
            <Schedule>
              <Input type="date" name="schedule" min={dateMin} placeholder="Data de Vencimento" />
              <Select name="status" options={options} placeholder="Status" />
            </Schedule>
            <TextArea name="description" placeholder="Atividade" />
            <Button type="submit">Cadastrar</Button>
          </Form>
        </FormContainer>
      </Container>
    </ModalContainer>
  )
}

export default NewActivityModal
