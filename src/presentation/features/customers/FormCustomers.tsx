import {Toast} from 'primereact/toast'
import {Form} from '../../components/ui/Forms/Form'
import type { IShow } from '../../../core/shared/types/forms'
import {useCustomersStore} from '../../../infrastructure/stores/customers.store'
import {useCustomersForm} from './hooks/useCustomersForm'

export const FormCustomers = ({
  onActionForm,
  showForm,
  setShowForm
}: IShow) => {
  const form = useCustomersForm({ onActionForm, setShowForm })

  return (
    <>
      <Toast ref={form.toast} />
      <Form
        width='55%'
        showForm={showForm}
        setShowForm={setShowForm}
        handleSave={form.handleSave}
        title='Registrar huesped'
        fields={form.fields}
        validationSchema={form.validationSchema}
        useStoreForm={useCustomersStore}
      />
    </>
  )
}
