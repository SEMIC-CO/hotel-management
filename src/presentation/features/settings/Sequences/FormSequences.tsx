import {Toast} from 'primereact/toast'
import type { IField, IShow } from '../../../../core/shared/types/forms'
import {useCentersStore} from '../../../../infrastructure/stores/centers.store'
import {Form} from '../../../components/ui/Forms/Form'
import {useContainer} from '../../../hooks/useContainer'
import {useSettingsForm} from '../hooks/useSettingsForm'
import * as Yup from 'yup'

export const FormSequences = ({ onActionForm, showForm, setShowForm }: IShow) => {
  const { settingsRepository } = useContainer()
  const { resetState } = useCentersStore()

  const fields: IField[] = [
    {
      label: 'Tipo de documento',
      placeholder: 'Nombre de centro',
      name: 'document_type',
      type: 'select',
      options: [{ key: 'INVOICE', code: 'INVOICE', name: 'FACTURA' }],
      required: true
    },
    {
      label: 'Nombre del consecutivo',
      placeholder: 'Nombre del consecutivo',
      name: 'sequence_name',
      type: 'text',
      required: true
    },
    {
      label: 'Prefijo',
      placeholder: 'Prefijo',
      name: 'prefix',
      type: 'text',
      required: true
    },
    {
      label: 'Numero inicial',
      placeholder: 'Numero inicial',
      name: 'start_number',
      type: 'text',
      keyfilter: 'int',
      required: true
    },
    {
      label: 'Numero final',
      placeholder: 'Numero final',
      name: 'end_number',
      type: 'text',
      keyfilter: 'int',
      required: true
    },
    {
      label: 'Numero de la resolución',
      placeholder: 'Numero de la resolución',
      name: 'resolution_number',
      type: 'text',
      keyfilter: 'int',
      required: true
    },
    {
      label: 'Valido desde',
      name: 'valid_from',
      type: 'date',
      required: true
    },
    {
      label: 'Activar',
      placeholder: 'Seleccion para activar',
      name: 'is_active',
      type: 'select',
      options: [
        { key: 'true', code: 'true', name: 'SI' },
        { key: 'false', code: 'false', name: 'NO' }
      ],
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
        width='50%'
        showForm={showForm}
        setShowForm={setShowForm}
        handleSave={form.handleSave}
        title='Crear consecutivo'
        fields={form.fields}
        validationSchema={form.validationSchema}
        useStoreForm={useCentersStore}
      />
    </>
  )
}
