import {Toast} from 'primereact/toast'
import {Form} from '../../components/ui/Forms/Form'
import type { IShow } from '../../../core/shared/types/forms'
import {useCentersStore} from '../../../infrastructure/stores/centers.store'
import Loading from '../../components/ui/UX/Loading'
import {useAdvanceForm} from './hooks/useAdvanceForm'

export const FormAdavances = ({
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
        useStoreForm={useCentersStore}
      />
    </>
  )
}
