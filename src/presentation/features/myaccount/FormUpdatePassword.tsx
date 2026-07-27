import {Card} from 'primereact/card'
import {Form} from '../../components/ui/Forms/Form'
import type { IField } from '../../../core/shared/types/forms'
import * as Yup from 'yup'
import {useUsersStore} from '../../../infrastructure/stores/user.store'

export const FormUpdatePassword = () => {
  const handleSave = () => {
    // TODO: implementar cambio de contraseña
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
        <Form
          type='normal'
          handleSave={handleSave}
          fields={fields}
          validationSchema={validationSchema}
          useStoreForm={useUsersStore}
        />
      </Card>
    </>
  )
}
