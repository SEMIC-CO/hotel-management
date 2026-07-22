import {useCallback, useEffect, useRef, useState} from 'react'
import * as Yup from 'yup'
import {Toast} from 'primereact/toast'
import type {
  IField,
  IOptionsRadio,
  IOptionsSelect,
  IPropsSave,
  ISearch,
  IShow
} from '../../../../core/shared/types/forms'
import type { IEntries } from '../../../../core/shared/types/data'
import {useEntriesStore} from '../../../../infrastructure/stores/entries.store'
import {useContainer} from '../../../hooks/useContainer'
import dayjs from 'dayjs'

export const useEntriesForm = ({
  onActionForm,
  setShowForm
}: Omit<IShow, 'showForm'>) => {
  const toast = useRef<Toast>(null)
  const { entryRepository, customerRepository, bedroomRepository } = useContainer()

  const valueState = useEntriesStore((state) => state.values as IEntries)
  const updateState = useEntriesStore((state) => state.updateState)
  const resetState = useEntriesStore((state) => state.resetState)

  const itemsRadio = [
    { id: 'val_min', label: 'Val mínimo: 0', value: 0 },
    { id: 'val_max', label: 'Val máximo: 0', value: 0 }
  ]

  const [rooms, setRooms] = useState<IOptionsSelect[]>([])
  const [optionRadio, setOptionRadio] = useState<IOptionsRadio[]>(itemsRadio)
  const [customersAll, setCustomersAll] = useState<ISearch[]>([])

  useEffect(() => {
    setOptionRadio(itemsRadio)
  }, [valueState.val_room === 0])

  useEffect(() => {
    calculateDays()
  }, [valueState.entry_date, valueState.exit_date])

  useEffect(() => {
    customerRepository.getCustomerSearch('?select=true').then((resp) => {
      setCustomersAll(resp ?? [])
    })
    bedroomRepository.getRoomSelect('?select=true').then((resp) => {
      if (typeof resp !== 'undefined') {
        setRooms(resp ?? [])
      }
    })
  }, [customerRepository, bedroomRepository])

  const calculateDays = () => {
    let days = 0
    if (valueState.entry_date === '' || valueState.exit_date === '') {
      days = 0
    } else {
      const dateInit = dayjs(valueState.entry_date)
      const dateEnd = dayjs(valueState.exit_date)
      days = dateEnd.diff(dateInit, 'days')
    }
    updateState({
      ...valueState,
      total_days: days,
      total_amount_pay:
        typeof valueState.val_room !== 'undefined'
          ? days * valueState.val_room
          : 0
    })
  }

  const handleSave = useCallback(
    ({ values, setLoading }: IPropsSave) => {
      values.center_id = 1
      values.created_by = 1
      values.customer_id = values.no_document
      let typeToast: 'success' | 'info' | 'warn' | 'error' | undefined = 'error'
      setLoading(true)
      entryRepository.save(values).then((resp) => {
        if (typeof resp === 'undefined') return
        if (resp.ok) {
          onActionForm?.(resp.data)
          setOptionRadio(itemsRadio)
          setShowForm(false)
          resetState()
          typeToast = 'success'
        }
        setLoading(false)
        toast.current?.show({
          severity: typeToast,
          summary: '',
          detail: resp.message
        })
      })
    },
    [entryRepository, onActionForm, setShowForm, resetState]
  )

  const onChangeSearch = (e: any) => {
    updateState({ ...valueState, names: e.value.fullname })
  }

  const onSelectRoom = (e: any) => {
    setOptionRadio([
      {
        id: 'val_min',
        label: `Val mínimo: $${e.value.val_min}`,
        value: e.value.val_min
      },
      {
        id: 'val_max',
        label: `Val máximo: $${e.value.val_max}`,
        value: e.value.val_max
      }
    ])
  }

  const onSetValueInit = (val: string) => {
    updateState({ ...valueState, entry_date: val })
  }

  const onSetValueEnd = (val: string) => {
    updateState({ ...valueState, exit_date: val })
  }

  const onSelectRadio = (val: number) => {
    updateState({
      ...valueState,
      val_room: val,
      total_amount_pay: val * valueState.total_days
    })
  }

  const validationSchema = Yup.object({
    names: Yup.string().required('Requerido'),
    no_document: Yup.string().required('Requerido'),
    entry_date: Yup.string().required('Requerido'),
    exit_date: Yup.string().required('Requerido'),
    total_days: Yup.number().required('Requerido'),
    room_id: Yup.number().required('Requerido'),
    val_room: Yup.number().required('Requerido'),
    total_amount_pay: Yup.number().required('Requerido')
  })

  const fields: IField[] = [
    {
      label: 'Documento cliente',
      placeholder: 'Buscar cliente',
      name: 'no_document',
      type: 'search',
      items: customersAll,
      onSelect: onChangeSearch,
      keyfilter: 'int',
      required: true
    },
    {
      label: 'Nombres',
      name: 'names',
      type: 'text',
      value: valueState.names,
      disabled: true,
      required: true
    },
    {
      label: 'Fecha de entrada',
      name: 'entry_date',
      type: 'date',
      required: true,
      showTime: true,
      onSetValue: onSetValueInit
    },
    {
      label: 'Fecha de salida',
      name: 'exit_date',
      type: 'date',
      required: true,
      showTime: true,
      onSetValue: onSetValueEnd
    },
    {
      label: 'Total días',
      name: 'total_days',
      type: 'text',
      keyfilter: 'int',
      value: valueState.total_days,
      disabled: true,
      required: true
    },
    {
      label: 'Habitación',
      name: 'room_id',
      type: 'select',
      required: true,
      placeholder: 'Seleccione',
      options: rooms,
      onChangeFunc: onSelectRoom
    },
    {
      label: 'Valor habitación',
      name: 'val_room',
      type: 'radio',
      required: true,
      options: optionRadio,
      value: valueState.val_room,
      onSelect: onSelectRadio
    },
    {
      label: 'Valor día',
      name: 'val_day',
      type: 'number',
      required: true,
      disabled: true,
      value: valueState.val_room
    },
    {
      label: 'Total a pagar',
      name: 'total_amount_pay',
      type: 'number',
      disabled: true,
      required: true,
      value: valueState.total_amount_pay
    }
  ]

  return {
    toast,
    handleSave,
    validationSchema,
    fields
  }
}
