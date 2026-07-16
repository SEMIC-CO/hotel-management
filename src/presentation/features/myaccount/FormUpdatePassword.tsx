import {Card} from 'primereact/card'
import {FormHere} from '../../components/ui/Forms/FormHere'
import type { IField } from '../../../core/shared/types/forms'
import {useSessionStore} from '../../../infrastructure/stores/session.store'
import * as Yup from 'yup'
import {useUsersStore} from '../../../infrastructure/stores/user.store'

export const FormUpdatePassword = () => {
  const session = useSessionStore((state) => state.values)
  const { user } = session
  console.log('MyAccount', user)

  const handleSave = () => {
    console.log('handleSave')
    // Simulate API call
  }

  const fields: IField[] = [
    {
      label: 'Contraseña actual',
      name: 'password_current',
      type: 'text'
    },
    {
      label: 'Contraseña nueva',
      name: 'password',
      type: 'text'
    },
    {
      label: 'Confirmar contraseña',
      name: 'password_confirm',
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
        <h2 className='font-bold text-lg'>Cambiar contraseña</h2>
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
