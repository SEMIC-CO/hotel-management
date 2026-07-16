import {useCallback, useEffect, useRef, useState} from 'react'
import {Toast} from 'primereact/toast'
import {useContainer} from '../../../hooks/useContainer'
import type { IEntries } from '../../../../core/shared/types/data'
import {useEntriesStore} from '../../../../infrastructure/stores/entries.store'
import {useSessionStore} from '../../../../infrastructure/stores/session.store'
import {createParamsUrl} from '../../../../core/shared/utils/utils'

export const useEntriesList = () => {
  const { entryRepository } = useContainer()
  const { user } = useSessionStore((state) => state.values)
  const { updateState } = useEntriesStore()

  const [data, setData] = useState<IEntries[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<any>()
  const toast = useRef<Toast>(null)

  const refreshList = useCallback(() => {
    setLoading(true)
    const params = { company_id: user.company_id }
    const urlParams = createParamsUrl(params)
    entryRepository.get(urlParams).then((resp) => {
      setLoading(false)
      setData(resp ?? [])
    })
  }, [user.company_id, entryRepository])

  const update = useCallback(
    (row: IEntries | undefined) => {
      if (typeof row !== 'undefined') {
        row.names = row.customer
        row.val_day = row.val_room
        updateState(row)
      }
      setShowForm(true)
    },
    [updateState]
  )

  const cancelEntry = useCallback(
    (row: IEntries | undefined) => {
      if (typeof row !== 'undefined') {
        updateState(row)
      }
      setShowForm(true)
    },
    [updateState]
  )

  const onActionForm = useCallback(
    (val: any) => {
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
    { label: 'Id', name: 'entry_id', filter: true, sort: true, width: '2rem' },
    { label: 'Habitacion', name: 'no_room', filter: true, sort: true, width: '10rem' },
    { label: 'No Documento', name: 'no_document', filter: true, sort: true, width: '10rem' },
    { label: 'Cliente', name: 'customer', filter: true, sort: true, width: '10rem' },
    { label: 'Fecha Entrada', name: 'entry_date', filter: true, sort: true, width: '15rem' },
    { label: 'Fecha Salida', name: 'exit_date', filter: true, sort: true, width: '15rem' },
    { label: 'Días', name: 'total_days', sort: true, width: '5rem' },
    { label: 'Valor día', name: 'val_room', type: 'money', filter: true, sort: true, width: '10rem' },
    { label: 'Total a pagar', name: 'total_amount_pay', type: 'money', filter: true, sort: true, width: '10rem' },
    { label: 'Estado', name: 'status', filter: true, sort: true, width: '10rem' }
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
    cancelEntry,
    refreshList,
    onActionForm,
    toast
  }
}
