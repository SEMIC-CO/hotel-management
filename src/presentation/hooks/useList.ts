import { Toast } from 'primereact/toast'
import { useRef, useState } from 'react'
import { useSessionStore } from '../../infrastructure/stores/session.store'

export const useList = <T>() => {
  const [selectedRow, setSelectedRow] = useState<any>()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [action, setAction] = useState<'add' | 'edit'>('add')
  const toast = useRef<Toast>(null)
  const { user } = useSessionStore((state) => state.values)

  return {
    selectedRow,
    setSelectedRow,
    data,
    setData,
    loading,
    setLoading,
    showForm,
    setShowForm,
    toast,
    user,
    action,
    setAction
  }
}
