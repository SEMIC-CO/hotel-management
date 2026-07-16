import { Avatar } from 'primereact/avatar'
import { Card } from 'primereact/card'
import { useSessionStore } from '../../../infrastructure/stores/session.store'
// import { IField } from '../../../types/forms'
// import * as Yup from 'yup'
import { FormDataUser } from './FormDataUser'
import { FormUpdatePassword } from './FormUpdatePassword'

export const MyAccount = () => {
  const session = useSessionStore((state) => state.values)
  const { user } = session
  console.log('MyAccount', user)

  // const handleSave = () => {
  //   console.log('handleSave')
  //   // Simulate API call
  // }

  // const fields: IField[] = [
  //   {
  //     label: 'Nombres',
  //     name: 'names',
  //     type: 'text'
  //   },
  //   {
  //     label: 'Apellidos',
  //     name: 'surnames',
  //     type: 'text'
  //   },
  //   {
  //     label: 'Email / Usuario',
  //     name: 'email',
  //     type: 'text',
  //     keyfilter: 'email',
  //     placeholder: 'Email del usuario'
  //   },
  //   {
  //     label: 'No Celular',
  //     name: 'cell_phone',
  //     type: 'text',
  //     keyfilter: 'int'
  //   },
  //   {
  //     label: 'Dirección',
  //     name: 'address',
  //     type: 'text'
  //   }
  // ]

  // const validationSchema = Yup.object({
  //   names: Yup.string().required('Requerido'),
  //   surnames: Yup.string().required('Requerido'),
  //   cell_phone: Yup.string().required('Requerido'),
  //   email: Yup.string().email('E-mail no valido').required('Requerido')
  // })

  return (
    <section className='flex flex-row gap-2 text-left'>
      <Card>
        <div className='flex flex-row gap-2'>
          <Avatar
            label='P'
            size='xlarge'
            shape='circle'
          />
          <div className='text-left'>
            <h2 className='font-bold text-lg'>
              {user.names + ' ' + user.surnames}
            </h2>
            <p>{user.username}</p>
          </div>
        </div>
      </Card>
      <FormDataUser />
      <FormUpdatePassword />
    </section>
  )
}
