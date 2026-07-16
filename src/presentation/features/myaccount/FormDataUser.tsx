import {Card} from 'primereact/card'
import {FormHere} from '../../components/ui/Forms/FormHere'
import type { IField } from '../../../core/shared/types/forms'
import {useSessionStore} from '../../../infrastructure/stores/session.store'
import * as Yup from 'yup'
import {useUsersStore} from '../../../infrastructure/stores/user.store'

export const FormDataUser = () => {
  const session = useSessionStore((state) => state.values)
  const { user } = session
  console.log('MyAccount', user)

  const handleSave = () => {
    console.log('handleSave')
    // Simulate API call
  }

  const fields: IField[] = [
    {
      label: 'Nombres',
      name: 'names',
      type: 'text'
    },
    {
      label: 'Apellidos',
      name: 'surnames',
      type: 'text'
    },
    {
      label: 'No Celular',
      name: 'cell_phone',
      type: 'text',
      keyfilter: 'int'
    },
    {
      label: 'Dirección',
      name: 'address',
      type: 'text'
    }
  ]

  const validationSchema = Yup.object({
    names: Yup.string().required('Requerido'),
    surnames: Yup.string().required('Requerido'),
    cell_phone: Yup.string().required('Requerido'),
    email: Yup.string().email('E-mail no valido').required('Requerido')
  })
  return (
    <>
      <Card>
        <h2 className='font-bold text-lg'>Datos de usuario</h2>
        <p>Información de la cuenta del usuario.</p>
        <FormHere
          handleSave={handleSave}
          fields={fields}
          validationSchema={validationSchema}
          useStoreForm={useUsersStore}
        />
      </Card>
    </>
  )
}
