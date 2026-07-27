import { useCallback, useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { useList } from '../../../hooks/useList'
import { useUser } from '../../../hooks/useUser'
import { createParamsUrl } from '../../../../core/shared/utils/utils'

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
  const toastRef = useRef<Toast>(null)

  const refreshList = useCallback(() => {
    setLoading(true)
    const urlParams = createParamsUrl({ company_id: user.company_id })
    getFn(urlParams).then((resp) => {
      setData(resp ?? [])
      setLoading(false)
    })
  }, [user.company_id, getFn, setData, setLoading])

  useEffect(() => {
    refreshList()
  }, [refreshList])

  const deleteItem = useCallback(
    (row: any) => {
      const key = row[keyField]
      if (typeof key === 'undefined') return
      deleteFn(key).then((resp) => {
        if (typeof resp === 'undefined') return
        setData((prev) => prev.filter((p: any) => p[keyField] !== key))
        toastRef.current?.show({
          severity: 'error',
          summary: '',
          detail: resp.message
        })
      })
    },
    [deleteFn, keyField, setData]
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
