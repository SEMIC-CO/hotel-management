import {Toast} from 'primereact/toast'
import * as Yup from 'yup'
import {Form} from '../../../components/ui/Forms/Form'
import type { IField, IOptionsSelect, IShow } from '../../../../core/shared/types/forms'
import {useContainer} from '../../../hooks/useContainer'
import {useUsersStore} from '../../../../infrastructure/stores/user.store'
import {useSettingsForm} from '../hooks/useSettingsForm'
import {useCenters, useProfiles} from '../../../hooks/useDataConfig'

export const FormUsers = ({ onActionForm, showForm, setShowForm }: IShow) => {
  const { settingsRepository } = useContainer()
  const { resetState } = useUsersStore()
  const profiles = useProfiles<IOptionsSelect>('select')
  const centers = useCenters<IOptionsSelect>('select')

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
      label: 'Email / Usuario',
      name: 'email',
      type: 'text',
      keyfilter: 'email',
      placeholder: 'Email del usuario'
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
    },
    {
      label: 'Perfil',
      name: 'profile_id',
      type: 'select',
      placeholder: 'Seleccione',
      options: profiles
    },
    {
      label: 'Centro',
      name: 'center_id',
      type: 'select',
      placeholder: 'Seleccione',
      options: centers
    },
    {
      label: 'Estado',
      name: 'state',
      type: 'select',
      placeholder: 'Seleccione',
      options: [
        { name: 'ACTIVO', code: 'ACTIVO' },
        { name: 'INACTIVO', code: 'INACTIVO' }
      ]
    }
  ]

  const validationSchema = Yup.object({
    names: Yup.string().required('Requerido'),
    surnames: Yup.string().required('Requerido'),
    cell_phone: Yup.string().required('Requerido'),
    email: Yup.string().email('E-mail no valido').required('Requerido'),
    profile_id: Yup.string().required('Requerido'),
    state: Yup.string().required('Requerido')
  })

  const form = useSettingsForm({
    saveFn: (values) => {
      values.profile_id = 4
      values.username = values.email
      values.password = values.username
      values.type = 'SISTEMA'
      return settingsRepository.saveUsers(values)
    },
    resetState,
    fields,
    validationSchema,
    onActionForm,
    setShowForm
  })

  return (
    <>
      <Toast ref={form.toast} />
      <Form
        width='42%'
        showForm={showForm}
        setShowForm={setShowForm}
        handleSave={form.handleSave}
        title='Crear usuario'
        fields={form.fields}
        validationSchema={form.validationSchema}
        useStoreForm={useUsersStore}
      />
    </>
  )
}
