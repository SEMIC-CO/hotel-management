import {useCallback, useRef} from 'react'
import {Toast} from 'primereact/toast'
import type { IPropsSave, IShow } from '../../../../core/shared/types/forms'
import type { ICustomers } from '../../../../core/shared/types/data'
import {useContainer} from '../../../hooks/useContainer'
import {useCustomersStore} from '../../../../infrastructure/stores/customers.store'
import {buildCustomerFields, customerValidationSchema} from '../configCustomerFieldsMode'

export const useCustomersForm = ({
  onActionForm,
  setShowForm
}: Omit<IShow, 'showForm'>) => {
  const toast = useRef<Toast>(null)
  const { customerRepository } = useContainer()
  const { resetState } = useCustomersStore()

  const handleSave = useCallback(
    ({ values, setLoading }: IPropsSave<ICustomers>) => {
      let typeToast: 'success' | 'info' | 'warn' | 'error' | undefined = 'error'
      setLoading(true)
      customerRepository.save(values).then((resp) => {
        if (typeof resp === 'undefined') return
        if (resp.ok) {
          onActionForm?.(resp.data)
          setShowForm(false)
          typeToast = 'success'
          resetState()
        }
        setLoading(false)
        toast.current?.show({
          severity: typeToast,
          summary: '',
          detail: resp.message
        })
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
