import {Toast} from 'primereact/toast'
import {Form} from '../../components/ui/Forms/Form'
import type { IShow } from '../../../core/shared/types/forms'
import Loading from '../../components/ui/UX/Loading'
import {useAdvanceForm} from './hooks/useAdvanceForm'
import { useAdvancesStore } from '../../../infrastructure/stores/advances.store'

export const FormAdvances = ({
  onActionForm,
  showForm,
  setShowForm
}: IShow) => {
  const form = useAdvanceForm({ onActionForm, setShowForm })
  return (
    <>
      <Toast ref={form.toast} />
      {form.loading && <Loading />}
      <Form
        width='50%'
        showForm={showForm}
        setShowForm={setShowForm}
        handleSave={form.handleSave}
        title='Agregar anticipo'
        fields={form.fields}
        validationSchema={form.validationSchema}
        useStoreForm={useAdvancesStore}
      />
    </>
  )
}
