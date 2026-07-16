import {Toast} from 'primereact/toast'
import {Form} from '../../../components/ui/Forms/Form'
import type { IField, IOptionsSelect, IShow } from '../../../../core/shared/types/forms'
import {useCities} from '../../../hooks/useDataConfig'
import {useCentersStore} from '../../../../infrastructure/stores/centers.store'
import {useSettingsForm} from '../hooks/useSettingsForm'
import {useContainer} from '../../../hooks/useContainer'
import * as Yup from 'yup'

export const FormCenters = ({ onActionForm, showForm, setShowForm }: IShow) => {
  const { settingsRepository } = useContainer()
  const cities = useCities<IOptionsSelect>('select')
  const { resetState } = useCentersStore()

  const fields: IField[] = [
    {
      label: 'Nombre de centro',
      placeholder: 'Nombre de centro',
      name: 'center_name',
      type: 'text',
      required: true
    },
    {
      label: 'Dirección',
      placeholder: 'Escriba su dirección',
      name: 'address',
      type: 'text',
      required: true
    },
    {
      label: 'No Celular',
      placeholder: 'No celular',
      name: 'phone',
      type: 'text',
      keyfilter: 'int',
      required: true
    },
    {
      label: 'Ciudad',
      name: 'city',
      type: 'select',
      options: cities,
      required: true
    }
  ]

  const validationSchema = Yup.object({
    center_name: Yup.string().required('Requerido'),
    address: Yup.string().required('Requerido'),
    phone: Yup.string().required('Requerido'),
    city: Yup.string().required('Requerido')
  })

  const form = useSettingsForm({
    saveFn: settingsRepository.saveCenters,
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
        width='40%'
        showForm={showForm}
        setShowForm={setShowForm}
        handleSave={form.handleSave}
        title='Crear centro'
        fields={form.fields}
        validationSchema={form.validationSchema}
        useStoreForm={useCentersStore}
      />
    </>
  )
}
