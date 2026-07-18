import {Toast} from 'primereact/toast'
import * as Yup from 'yup'
import type { IField, IOptionsSelect, IShow } from '../../../../core/shared/types/forms'
import {Form} from '../../../components/ui/Forms/Form'
import {useContainer} from '../../../hooks/useContainer'
import {useBanksAccountsStore} from '../../../../infrastructure/stores/settings.store'
import {useSettingsForm} from '../hooks/useSettingsForm'
import {useBanks} from '../../../hooks/useDataConfig'

export const FormBanksAccount = ({ onActionForm, showForm, setShowForm }: IShow) => {
  const { settingsRepository } = useContainer()
  const { resetState } = useBanksAccountsStore()
  const banks = useBanks<IOptionsSelect>('select')

  const fields: IField[] = [
    {
      label: 'Banco',
      name: 'bank_id',
      type: 'select',
      options: banks,
      required: true
    },
    {
      label: 'Número de cuenta',
      placeholder: 'Número de cuenta',
      name: 'number_accounts',
      type: 'text',
      keyfilter: 'int',
      required: true
    },
    {
      label: 'Tipo de cuenta',
      name: 'type',
      type: 'select',
      options: [
        { code: 'AHORROS', name: 'AHORROS' },
        { code: 'CORRIENTE', name: 'CORRIENTE' }
      ],
      required: true
    }
  ]

  const validationSchema = Yup.object({
    bank_id: Yup.string().required('Requerido'),
    number_accounts: Yup.string().required('Requerido'),
    type: Yup.string().required('Requerido')
  })

  const form = useSettingsForm({
    saveFn: settingsRepository.saveBanksAccount,
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
        width='45%'
        showForm={showForm}
        setShowForm={setShowForm}
        handleSave={form.handleSave}
        title='Crear cuenta bancaria'
        fields={form.fields}
        validationSchema={form.validationSchema}
        useStoreForm={useBanksAccountsStore}
      />
    </>
  )
}
