import {useCallback, useEffect, useRef, useState} from 'react'
import * as Yup from 'yup'
import {Toast} from 'primereact/toast'
import type { IField, IOptionsSelect, IPropsSave, IShow } from '../../../../core/shared/types/forms'
import type { IBedrooms } from '../../../../core/shared/types/data'
import {useContainer} from '../../../hooks/useContainer'
import {useBedroomsStore} from '../../../../infrastructure/stores/bedrooms.store'
import {ROOM_STATES} from '../../../../core/shared/utils/constants'
import {createParamsUrl} from '../../../../core/shared/utils/utils'
import {useUser} from '../../../hooks/useUser'

export const useBedroomsForm = ({
  onActionForm,
  setShowForm
}: Omit<IShow, 'showForm'>) => {
  const toast = useRef<Toast>(null)
  const { bedroomRepository, settingsRepository } = useContainer()
  const { resetState } = useBedroomsStore()
  const user = useUser()

  const [roomTypes, setRoomTypes] = useState<IOptionsSelect[]>([])

  useEffect(() => {
    const params = createParamsUrl({
      select: true,
      center_id: user.center_id,
      company_id: user.company_id
    })
    settingsRepository.getRoomTypes(params).then((resp) => {
      if (typeof resp !== 'undefined') {
        setRoomTypes(resp ?? [])
      }
    })
  }, [user.center_id, user.company_id, settingsRepository])

  const handleSave = useCallback(
    ({ values, setLoading }: IPropsSave<IBedrooms>) => {
      let typeToast: 'success' | 'info' | 'warn' | 'error' | undefined = 'error'
      setLoading(true)
      bedroomRepository.save(values).then((resp) => {
        if (typeof resp === 'undefined') return
        if (resp.ok) {
          setShowForm(false)
          onActionForm?.(resp.data)
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
    [bedroomRepository, onActionForm, setShowForm, resetState]
  )

  const validationSchema = Yup.object({
    no_room: Yup.string().required('Requerido'),
    val_min: Yup.number().required('Requerido'),
    val_max: Yup.number().required('Requerido'),
    room_type: Yup.number().required('Requerido')
  })

  const fields: IField[] = [
    { label: 'No Habitación', name: 'no_room', type: 'text' },
    {
      label: 'Tipo de habitación',
      name: 'room_type',
      type: 'select',
      placeholder: 'Seleccione',
      options: roomTypes
    },
    { label: 'Valor minimo', name: 'val_min', type: 'number' },
    { label: 'Valor maximo', name: 'val_max', type: 'number' },
    {
      label: 'Estado',
      name: 'state',
      type: 'select',
      options: ROOM_STATES
    },
    { label: 'Descripción', name: 'description', type: 'textArea' }
  ]

  return {
    toast,
    handleSave,
    validationSchema,
    fields
  }
}
