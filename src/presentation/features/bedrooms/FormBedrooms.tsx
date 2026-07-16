import {Form} from '../../components/ui/Forms/Form'
import type { IShow } from '../../../core/shared/types/forms'
import {useBedroomsStore} from '../../../infrastructure/stores/bedrooms.store'
import {useBedroomsForm} from './hooks/useBedroomsForm'

export const FormBedrooms = ({
  showForm,
  setShowForm,
  onActionForm
}: IShow) => {
  const form = useBedroomsForm({ onActionForm, setShowForm })

  return (
    <>
      <Form
        showForm={showForm}
        setShowForm={setShowForm}
        handleSave={form.handleSave}
        title='Crear habitación'
        fields={form.fields}
        validationSchema={form.validationSchema}
        useStoreForm={useBedroomsStore}
      />
    </>
  )
}
