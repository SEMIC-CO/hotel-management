import {useCallback, useEffect, useRef, useState} from 'react'
import {Toast} from 'primereact/toast'
import {useContainer} from '../../../hooks/useContainer'
import type { IBedrooms } from '../../../../core/shared/types/data'
import {useBedroomsStore} from '../../../../infrastructure/stores/bedrooms.store'
import {useUser} from '../../../hooks/useUser'
import {createParamsUrl} from '../../../../core/shared/utils/utils'
import { getApiErrorMessage } from '../../../../infrastructure/api/client/httpClient'

export const useBedroomsList = () => {
  const { bedroomRepository } = useContainer()
  const user = useUser()
  const { updateState } = useBedroomsStore()

  const [showForm, setShowForm] = useState(false)
  const [data, setData] = useState<IBedrooms[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<any>()
  const toast = useRef<Toast>(null)

  const refreshList = useCallback(() => {
    setLoading(true)
    const params = {
      company_id: user.company_id,
      center_id: user.center_id
    }
    const urlParams = createParamsUrl(params)
    bedroomRepository
      .get(urlParams)
      .then((resp) => {
        setData(resp)
      })
      .catch((error) => {
        setData([])
        toast.current?.show({
          severity: 'error',
          summary: '',
          detail: getApiErrorMessage(error, 'No se pudo cargar la lista de habitaciones.')
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user.company_id, user.center_id, bedroomRepository])

  const update = useCallback(
    (row: IBedrooms) => {
      setShowForm(true)
      updateState(row)
    },
    [updateState]
  )

  const deleteItem = useCallback(
    (row: IBedrooms | undefined) => {
      if (typeof row === 'undefined') return
      bedroomRepository
        .delete(row.room_id)
        .then((resp) => {
          if (resp.ok) {
            setData((prev) => prev.filter((p) => p.room_id !== row.room_id))
          }
          toast.current?.show({
            severity: resp.ok ? 'success' : 'error',
            summary: '',
            detail: resp.message ?? 'No fue posible eliminar la habitación.'
          })
        })
        .catch((error) => {
          toast.current?.show({
            severity: 'error',
            summary: '',
            detail: getApiErrorMessage(error, 'No fue posible eliminar la habitación.')
          })
        })
    },
    [bedroomRepository]
  )

  const onActionForm = useCallback(
    (val: IBedrooms) => {
      if (typeof val.key !== 'undefined') {
        setData((prev) =>
          prev.map((item) => (item.key === val.key ? val : item))
        )
      } else {
        val.key = val.room_id
        setData((prev) => [...prev, val])
      }
    },
    []
  )

  useEffect(() => {
    refreshList()
  }, [refreshList])

  const columns = [
    { name: 'room_id', label: 'id', filter: true, sort: true, width: '2rem' },
    { name: 'no_room', label: 'No Habitación', filter: true, sort: true, width: '10rem' },
    { name: 'val_min', label: 'Valor mínimo', type: 'money', filter: true, sort: true, width: '10rem' },
    { name: 'val_max', label: 'Valor máximo', type: 'money', filter: true, sort: true, width: '10rem' },
    { name: 'room_type', label: 'Tipo de habitación', filter: true, sort: true, width: '10rem', hidden: true },
    { name: 'room_type_name', label: 'Tipo de habitación', filter: true, sort: true, width: '10rem' },
    { name: 'description', label: 'Descripción', filter: false, width: '20rem' },
    { name: 'state', label: 'Estado', filter: true, sort: true, width: '10rem' }
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
