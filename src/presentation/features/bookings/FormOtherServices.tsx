import {Toast} from 'primereact/toast'
import {Form} from '../../components/ui/Forms/Form'
import type { IShow } from '../../../core/shared/types/forms'
import Loading from '../../components/ui/UX/Loading'
import { useOtherServicesForm } from './hooks/useOtherServicesForm'
import { useOtherServicesStore } from '../../../infrastructure/stores/otherServices.store'

export const FormOtherServices = ({
  onActionForm,
  showForm,
  setShowForm
}: IShow) => {
  const form = useOtherServicesForm({ onActionForm, setShowForm })
  return (
    <>
      <Toast ref={form.toast} />
      {form.loading && <Loading />}
      <Form
        width='50%'
        showForm={showForm}
        setShowForm={setShowForm}
        handleSave={form.handleSave}
        title='Agregar otros servicios'
        fields={form.fields}
        validationSchema={form.validationSchema}
        useStoreForm={useOtherServicesStore}
      />
    </>
  )
}
