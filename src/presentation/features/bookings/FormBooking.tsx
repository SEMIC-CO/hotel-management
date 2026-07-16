import {Toast} from 'primereact/toast'
import {Form} from '../../components/ui/Forms/Form'
import type { IShow } from '../../../core/shared/types/forms'
import {useBookingStore} from '../../../infrastructure/stores/booking.store'
import Loading from '../../components/ui/UX/Loading'
import {useBookingForm} from './hooks/useBookingForm'

export const FormBooking = ({
  onActionForm,
  showForm,
  setShowForm,
  action
}: IShow) => {
  const form = useBookingForm({ onActionForm, setShowForm, action })

  return (
    <>
      <Toast ref={form.toast} />
      {form.loading && <Loading />}
      <Form
        width='67%'
        showForm={showForm}
        setShowForm={setShowForm}
        handleSave={form.handleSave}
        title='Registrar reservación'
        fields={form.fields}
        validationSchema={form.validationSchema}
        useStoreForm={useBookingStore}
        classForm='block'
      />
    </>
  )
}
