import { useCallback, useEffect, useState } from 'react'
import { useList } from '../../../hooks/useList'
import { useUser } from '../../../hooks/useUser'
import { createParamsUrl } from '../../../../core/shared/utils/utils'
import { getApiErrorMessage } from '../../../../infrastructure/api/client/httpClient'

interface UseSettingsListOptions {
  getFn: (params: string) => Promise<any[] | undefined>
  deleteFn: (id: number) => Promise<any>
  keyField?: string
}

export const useSettingsList = (
  options: UseSettingsListOptions
) => {
  const { getFn, deleteFn, keyField = 'key' } = options
  const user = useUser()
  const {
    selectedRow,
    setSelectedRow,
    data,
    setData,
    loading,
    setLoading,
    showForm,
    setShowForm,
    toast,
    setAction
  } = useList<any>()

  const [columns, setColumns] = useState<any[]>([])

  const refreshList = useCallback(() => {
    setLoading(true)
    const urlParams = createParamsUrl({ company_id: user.company_id })
    getFn(urlParams)
      .then((resp) => {
        setData(resp ?? [])
      })
      .catch((error) => {
        setData([])
        toast.current?.show({
          severity: 'error',
          summary: '',
          detail: getApiErrorMessage(error, 'No se pudo cargar la información.')
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user.company_id, getFn, setData, setLoading, toast])

  useEffect(() => {
    refreshList()
  }, [refreshList])

  const deleteItem = useCallback(
    (row: any) => {
      const key = row[keyField]
      if (typeof key === 'undefined') return
      deleteFn(key)
        .then((resp) => {
          if (resp.ok) {
            setData((prev) => prev.filter((item: any) => item[keyField] !== key))
          }
          toast.current?.show({
            severity: resp.ok ? 'success' : 'error',
            summary: '',
            detail: resp.message ?? 'No fue posible eliminar el registro.'
          })
        })
        .catch((error) => {
          toast.current?.show({
            severity: 'error',
            summary: '',
            detail: getApiErrorMessage(error, 'No fue posible eliminar el registro.')
          })
        })
    },
    [deleteFn, keyField, setData, toast]
  )

  const onActionForm = useCallback(
    (val: any) => {
      const key = val[keyField]
      if (typeof key !== 'undefined') {
        setData((prev) =>
          prev.map((item: any) =>
            item[keyField] === key ? val : item
          )
        )
      } else {
        setData((prev) => [...prev, val])
      }
    },
    [keyField, setData]
  )

  return {
    selectedRow,
    setSelectedRow,
    data,
    setData,
    loading,
    showForm,
    setShowForm,
    toast,
    setAction,
    columns,
    setColumns,
    deleteItem,
    refreshList,
    onActionForm
  }
}
