import {Toast} from 'primereact/toast'
import * as Yup from 'yup'
import type { IField, IShow } from '../../../../core/shared/types/forms'
import {Form} from '../../../components/ui/Forms/Form'
import {useContainer} from '../../../hooks/useContainer'
import {useTypeRoomStore} from '../../../../infrastructure/stores/settings.store'
import {useSettingsForm} from '../hooks/useSettingsForm'

export const FormTypeRoom = ({ onActionForm, showForm, setShowForm }: IShow) => {
  const { settingsRepository } = useContainer()
  const { resetState } = useTypeRoomStore()

  const fields: IField[] = [
    {
      label: 'Tipo habitación',
      placeholder: 'Tipo habitación',
      name: 'name',
      type: 'text',
      required: true
    }
  ]

  const validationSchema = Yup.object({
    name: Yup.string().required('Requerido')
  })

  const form = useSettingsForm({
    saveFn: (values) => {
      values.type = 'USUARIO'
      return settingsRepository.saveRoomsType(values)
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
        width='20%'
        showForm={showForm}
        setShowForm={setShowForm}
        handleSave={form.handleSave}
        title='Crear Tipo Habitación'
        fields={form.fields}
        validationSchema={form.validationSchema}
        useStoreForm={useTypeRoomStore}
      />
    </>
  )
}
