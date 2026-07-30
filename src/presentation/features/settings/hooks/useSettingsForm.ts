import {useCallback} from 'react'
import type { IField, IPropsSave, IShow } from '../../../../core/shared/types/forms'
import {useToast} from '../../../hooks/useToast'
import { getApiErrorMessage } from '../../../../infrastructure/api/client/httpClient'

interface UseSettingsFormOptions {
  saveFn: (values: any) => Promise<any>
  resetState: () => void
  fields: IField[]
  validationSchema: any
}

export const useSettingsForm = (
  options: UseSettingsFormOptions & Omit<IShow, 'showForm'>
) => {
  const { saveFn, resetState, fields, validationSchema, onActionForm, setShowForm } = options
  const { toast, showToast } = useToast()

  const handleSave = useCallback(
    ({ values, setLoading }: IPropsSave) => {
      setLoading(true)
      saveFn(values)
        .then((resp) => {
          if (resp.ok) {
            onActionForm?.(resp.data)
            setShowForm(false)
            resetState()
            showToast(
              resp.message ?? 'Datos guardados correctamente!',
              'success'
            )
            return
          }
          showToast(
            `Error al crear el registro, ${resp.message ?? 'intente nuevamente'}`,
            'error'
          )
        })
        .catch((error) => {
          showToast(
            getApiErrorMessage(error, 'No se pudo guardar la información.'),
            'error'
          )
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [saveFn, resetState, onActionForm, setShowForm, showToast]
  )

  return {
    toast,
    handleSave,
    fields,
    validationSchema
  }
}
