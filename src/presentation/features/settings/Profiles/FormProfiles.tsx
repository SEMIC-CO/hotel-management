import {Toast} from 'primereact/toast'
import * as Yup from 'yup'
import type { IField, IShow } from '../../../../core/shared/types/forms'
import {Form} from '../../../components/ui/Forms/Form'
import {useContainer} from '../../../hooks/useContainer'
import {useProfilesStore} from '../../../../infrastructure/stores/settings.store'
import {useSettingsForm} from '../hooks/useSettingsForm'

export const FormProfiles = ({ onActionForm, showForm, setShowForm }: IShow) => {
  const { settingsRepository } = useContainer()
  const { resetState } = useProfilesStore()

  const fields: IField[] = [
    {
      label: 'Perfil',
      placeholder: 'Nombre de perfil',
      name: 'profile',
      type: 'text',
      required: true
    }
  ]

  const validationSchema = Yup.object({
    profile: Yup.string().required('Requerido')
  })

  const form = useSettingsForm({
    saveFn: (values) => {
      values.type = 'USUARIO'
      return settingsRepository.saveProfiles(values)
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
        title='Crear Perfil'
        fields={form.fields}
        validationSchema={form.validationSchema}
        useStoreForm={useProfilesStore}
      />
    </>
  )
}
