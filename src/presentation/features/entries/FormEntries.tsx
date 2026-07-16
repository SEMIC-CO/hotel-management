import {Form} from '../../components/ui/Forms/Form'
import type { IShow } from '../../../core/shared/types/forms'
import {useEntriesStore} from '../../../infrastructure/stores/entries.store'
import {useEntriesForm} from './hooks/useEntriesForm'

export const FormEntries = ({ onActionForm, showForm, setShowForm }: IShow) => {
  const form = useEntriesForm({ onActionForm, setShowForm })

  return (
    <>
      <Form
        width='60%'
        showForm={showForm}
        setShowForm={setShowForm}
        handleSave={form.handleSave}
        title='Registrar Entrada'
        fields={form.fields}
        validationSchema={form.validationSchema}
        useStoreForm={useEntriesStore}
      />
    </>
  )
}
