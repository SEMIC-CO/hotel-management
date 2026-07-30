import {useCallback, useRef} from 'react'
import {Toast} from 'primereact/toast'
import type { IPropsSave, IShow } from '../../../../core/shared/types/forms'
import type { ICustomers } from '../../../../core/shared/types/data'
import {useContainer} from '../../../hooks/useContainer'
import {useCustomersStore} from '../../../../infrastructure/stores/customers.store'
import {buildCustomerFields, customerValidationSchema} from '../configCustomerFieldsMode'
import { getApiErrorMessage } from '../../../../infrastructure/api/client/httpClient'

export const useCustomersForm = ({
  onActionForm,
  setShowForm
}: Omit<IShow, 'showForm'>) => {
  const toast = useRef<Toast>(null)
  const { customerRepository } = useContainer()
  const { resetState } = useCustomersStore()

  const handleSave = useCallback(
    ({ values, setLoading }: IPropsSave<ICustomers>) => {
      setLoading(true)
      customerRepository
        .save(values)
        .then((resp) => {
          if (resp.ok) {
            onActionForm?.(resp.data)
            setShowForm(false)
            resetState()
          }
          toast.current?.show({
            severity: resp.ok ? 'success' : 'error',
            summary: '',
            detail: resp.message ?? 'No fue posible guardar el cliente.'
          })
        })
        .catch((error) => {
          toast.current?.show({
            severity: 'error',
            summary: '',
            detail: getApiErrorMessage(error, 'No fue posible guardar el cliente.')
          })
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [customerRepository, onActionForm, setShowForm, resetState]
  )

  const fields = buildCustomerFields('full')

  return {
    toast,
    handleSave,
    validationSchema: customerValidationSchema,
    fields
  }
}
