import {Toast} from 'primereact/toast'
import {useRef} from 'react'
import type { typeToast } from '../../core/shared/types/types'

export const useToast = () => {
  const toast = useRef<Toast>(null)

  const showToast = (message: string, typeToast: typeToast) => {
    if (toast.current !== null) {
      toast.current.show({
        severity: typeToast,
        summary: '',
        detail: message
      })
    }
  }

  return { toast, showToast }
}
