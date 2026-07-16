import {useCallback, useEffect, useRef, useState} from 'react'
import {Toast} from 'primereact/toast'
import {useContainer} from '../../../hooks/useContainer'
import type { ICustomers } from '../../../../core/shared/types/data'
import {useCustomersStore} from '../../../../infrastructure/stores/customers.store'
import {useSessionStore} from '../../../../infrastructure/stores/session.store'
import {createParamsUrl} from '../../../../core/shared/utils/utils'

export const useCustomersList = () => {
  const { customerRepository } = useContainer()
  const { user } = useSessionStore((state) => state.values)
  const { updateState } = useCustomersStore()

  const [data, setData] = useState<ICustomers[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<any>()
  const toast = useRef<Toast>(null)

  const refreshList = useCallback(() => {
    setLoading(true)
    const params = {
      company_id: user.company_id,
      center_id: user.center_id
    }
    const urlParams = createParamsUrl(params)
    customerRepository.get(urlParams).then((resp) => {
      setLoading(false)
      setData(resp ?? [])
    })
  }, [user.company_id, user.center_id, customerRepository])

  const update = useCallback(
    (row: ICustomers) => {
      updateState(row)
      setShowForm(true)
    },
    [updateState]
  )

  const deleteItem = useCallback(
    (row: ICustomers) => {
      if (typeof row.key === 'undefined') return
      customerRepository.delete(row.key).then((resp) => {
        if (typeof resp === 'undefined') return
        setData((prev) => prev.filter((p) => p.key !== row.key))
        toast.current?.show({
          severity: 'error',
          summary: '',
          detail: resp.message
        })
      })
    },
    [customerRepository]
  )

  const onActionForm = useCallback(
    (val: ICustomers) => {
      if (typeof val.key !== 'undefined') {
        setData((prev) =>
          prev.map((item) => (item.key === val.key ? val : item))
        )
      } else {
        setData((prev) => [...prev, val])
      }
    },
    []
  )

  useEffect(() => {
    refreshList()
  }, [refreshList])

  const columns = [
    { name: 'customer_id', label: 'id', filter: true, sort: true, width: '2rem' },
    { name: 'names', label: 'Nombres', filter: true, sort: true, width: '10rem' },
    { name: 'surnames', label: 'Apellidos', filter: true, sort: true, width: '10rem' },
    { name: 'document_type', label: 'Tipo de documento', filter: true, sort: true, width: '10rem' },
    { name: 'no_document', label: 'No documento', filter: true, sort: true, width: '10rem' },
    { name: 'birthdate', label: 'Fecha de nacimiento', filter: true, sort: true, width: '10rem' },
    { name: 'email', label: 'Email', filter: true, sort: true, width: '10rem' },
    { name: 'cell_phone', label: 'Celular', filter: true, sort: true, width: '10rem' },
    { name: 'cell_phone_emergency', label: 'Celular de emergencia', filter: true, sort: true, width: '10rem' }
  ]

  return {
    data,
    loading,
    showForm,
    setShowForm,
    selectedRow,
    setSelectedRow,
    columns,
    update,
    deleteItem,
    refreshList,
    onActionForm,
    toast
  }
}
