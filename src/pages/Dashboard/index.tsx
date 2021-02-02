import React, {
  useCallback, useState, useRef, useEffect,
} from 'react'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { isValid } from 'cpf'
import getValidationErrors from '../../utils/getValidationErrors'
import api from '../../services/api'
import { formatDate } from '../../utils/formatDate'
import { capitalizeName } from '../../utils/formatNames'
import { ptBrStatus } from '../../utils/constants'
import { removeMask } from '../../utils/cpfMask'

import Input from '../../components/Input'
import Button from '../../components/Button'
import Select from '../../components/Select'
import NewPatientModal from '../../components/Modals/NewPatient'
import NewActivityModal from '../../components/Modals/NewActivity'

import {
  Header,
  ContainerActivities,
  ContainerPageHeader,
  ContainerRegister,
  FormContainer,
  TableContainer,
} from './styles'

interface DataResponse {
  id: string;
  patient: {
    name: string
    document: string
  }
  description: string
  status: string,
  schedule: Date
}

interface Activity {
  id: string
  patientDocument: string
  patientName: string
  description: string
  status: string
  schedule: string
}

interface FormData {
  patientDocument: string
  status: string
  schedule: Date
}

const options = [
  { value: 'Aberto', label: 'Aberto' },
  { value: 'Atrasado', label: 'Atrasado' },
  { value: 'Finalizado', label: 'Finalizado' },
]

const Dashboard: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[] | null>(null)
  const [isPatientModalVisible, setIsPatientModalVisible] = useState<boolean>(false)
  const [isActivityModalVisible, setIsActivityModalVisible] = useState<boolean>(false)

  const getActivities = useCallback(async () => {
    const { data } = await api.get('/activities')
    const activitiesList = data.map((activity: DataResponse) => ({
      id: activity.id,
      patientName: capitalizeName(activity.patient.name),
      patientDocument: activity.patient.document,
      schedule: formatDate(activity.schedule),
      description: activity.description,
      status: ptBrStatus[activity.status],
    }))
    return setActivities(activitiesList)
  }, [])

  const getCurrentActivities = () => filteredActivities || activities

  const filterActivities = (data: FormData) => activities.filter((activity) => {
    const unformattedDocument = removeMask(data.patientDocument)
    return (!unformattedDocument || unformattedDocument === activity.patientDocument)
     && (!data.status || data.status === activity.status)
     && (!data.schedule || formatDate(data.schedule) === activity.schedule)
  })

  const handleSubmit = async (data: FormData) => {
    if (!data.patientDocument && !data.schedule && !data.status) {
      setFilteredActivities(activities)
      return
    }
    try {
      formRef.current?.setErrors({})
      const schema = Yup.object().shape({
        patientDocument: Yup.string().test('test-document', 'CPF inválido', () => !data.patientDocument || isValid(data.patientDocument)),
      })
      await schema.validate(data, { abortEarly: false })
      const currentActivities = filterActivities(data)
      setFilteredActivities(currentActivities)
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors)
      }
    }
  }

  useEffect(() => {
    getActivities()
  }, [getActivities])

  const handleNewActivity = () => {
    setIsActivityModalVisible(true)
    setIsPatientModalVisible(false)
  }

  const handleNewPatient = () => {
    setIsActivityModalVisible(false)
    setIsPatientModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsPatientModalVisible(false)
    setIsActivityModalVisible(false)
    return getActivities()
  }

  return (
    <>
      <Header>
        <h1>Amparo Saúde</h1>
        <h1>Atividades</h1>
      </Header>
      <ContainerPageHeader>
        <ContainerActivities>
          <h2>Lista de Atividades</h2>
          <p> Início &gt; Lista de Atividades </p>
        </ContainerActivities>
        <ContainerRegister>
          <Button type="button" onClick={handleNewPatient}>Novo Paciente</Button>
          <Button type="button" onClick={handleNewActivity}>Nova Atividade</Button>
        </ContainerRegister>
      </ContainerPageHeader>
      {
        isPatientModalVisible
        && <NewPatientModal id="modal" onClose={handleCloseModal} />
      }
      {
        isActivityModalVisible
        && <NewActivityModal id="modal" onClose={handleCloseModal} />
      }
      <FormContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="patientDocument" placeholder="CPF do Paciente" isCpf />
          <Select name="status" options={options} placeholder="Status" />
          <Input name="schedule" type="Date" placeholder="Data" />
          <Button type="submit">Filtrar</Button>
        </Form>
      </FormContainer>
      <TableContainer>
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>CPF</th>
              <th>Data</th>
              <th>Atividade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {
            (getCurrentActivities()).map((activity) => (
              <tr key={activity.id}>
                <td>{activity.patientName}</td>
                <td>{activity.patientDocument}</td>
                <td>{activity.schedule}</td>
                <td>{activity.description}</td>
                <td>{activity.status}</td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </TableContainer>
    </>
  )
}

export default Dashboard
