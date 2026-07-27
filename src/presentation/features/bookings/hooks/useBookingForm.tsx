import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import * as Yup from 'yup'
import type {
  IField,
  IOptionsSelect,
  IPropsSave,
  ISearch,
  IShow
} from '../../../../core/shared/types/forms'
import type { IBookings } from '../../../../core/shared/types/data'
import dayjs from 'dayjs'
import {useBookingStore} from '../../../../infrastructure/stores/booking.store'
import {useUser} from '../../../hooks/useUser'
import {AddRoomReservations, type IGuestsRooms, type IReservation, type IRoomAvailability} from '../AddRoomReservations'
import {useToast} from '../../../hooks/useToast'
import {useContainer} from '../../../hooks/useContainer'
import {ACTION_TYPE, DOCUMENT_TYPES} from '../../../../core/shared/utils/constants'
import {createParamsUrl, formatCurrency} from '../../../../core/shared/utils/utils'
import {Button} from 'primereact/button'

export const useBookingForm = ({
  onActionForm,
  setShowForm,
  action
}: Omit<IShow, 'showForm'> & { action?: 'add' | 'edit' }) => {
  const [customersAll, setCustomersAll] = useState<ISearch[]>([])
  const { toast, showToast } = useToast()
  const { bookingRepository, customerRepository } = useContainer()
  const [loading, setLoading] = useState(false)

  const valueState = useBookingStore((state) => state.values)
  const updateState = useBookingStore((state) => state.updateState)
  const resetState = useBookingStore((state) => state.resetState)
  const user = useUser()

  const [roomTypes, setRoomTypes] = useState<IOptionsSelect[]>([])
  const [roomsAll, setRoomsAll] = useState<IOptionsSelect[]>([])
  const [dataList, setDataList] = useState<IReservation[]>([])
  const [labels, setLabels] = useState<any>({
    labelNames: 'Nombres',
    labelNoDoc: 'No documento',
    hiddenSurnames: false,
    requiredSurnames: true
  })
  const [guestRoomList, setGuestRoomList] = useState<IGuestsRooms[]>([])

  const addRoomRowRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (action !== 'edit') {
        setDataList([])
        setRoomsAll([])
        setGuestRoomList([])
        return
      }
      await fetchDataEdit()
    }
    fetchData()
  }, [action, valueState.booking_id])

  const assingRooms = async (rooms: any[]) => {
    const roomEdit = rooms.map((room: any) => ({
      key: room.rooms_reservations_id,
      code: room.room_id,
      name: room.no_room,
      val_max: room.val_max,
      val_min: room.val_min,
      id_room_type: room.room_type
    }))
    setRoomsAll((prev) => [...prev, ...roomEdit])
    return roomEdit
  }

  const fetchDataEdit = async () => {
    const availability = await getRoomsAvailable()
    let availableRooms = availability?.rooms ?? []

    const respListRooms = await bookingRepository.getDataEditBookings<any>(
      `?booking_id=${valueState.booking_id}`
    )

    if (typeof respListRooms !== 'undefined') {
      const rooms = respListRooms.rooms_reservations ?? []

      const guestRoomsList = rooms.flatMap((room: any) =>
        (room.guests_rooms ?? []).map((guestRoom: any) => ({
          key: guestRoom.guests_rooms_id,
          room_id: room.room_id,
          room: room.no_room,
          room_text: room.no_room,
          customer_id: guestRoom.customer_id,
          names: guestRoom.names,
          surnames: guestRoom.surnames,
          document_type: guestRoom.document_type,
          no_document: guestRoom.no_document,
          birthdate: guestRoom.birthdate || '',
          cell_phone: guestRoom.cell_phone,
          cell_phone_emergency: guestRoom?.cell_phone_emergency || ''
        }))
      )

      const roomsEdit = await assingRooms(rooms)
      availableRooms = [...availableRooms, ...roomsEdit]

      const rowlist = rooms.map((room: any) => ({
        key: room.rooms_reservations_id,
        price: room.price,
        price_text: formatCurrency(room.price),
        room: room.room_id,
        room_text: room.no_room,
        room_type: room.room_type,
        room_type_text: room.room_type_text,
        price_options: [
          { code: room.val_min, name: `Valor min: ${formatCurrency(room.val_min)}` },
          { code: room.val_max, name: `Valor max: ${formatCurrency(room.val_max)}` }
        ],
        room_options:
          availableRooms.filter((r) => r.id_room_type === room.room_type) ?? [],
        guests_rooms: guestRoomsList.filter(
          (guestRoom: IGuestsRooms) => guestRoom.room_id === room.room_id
        )
      }))

      setDataList(rowlist)
      setGuestRoomList(guestRoomsList)
    }

    return respListRooms
  }

  useEffect(() => {
    if (valueState.entry_date === '' || valueState.exit_date === '') {
      updateState({ total_days: 0, total_reservation: 0 })
      return
    }
    const dateInit = dayjs(valueState.entry_date)
    const dateEnd = dayjs(valueState.exit_date)
    let days = dateEnd.diff(dateInit, 'days')
    days = days === 0 ? 1 : days
    updateState({
      total_days: days,
      total_reservation: days * valueState.total_rooms
    })
  }, [valueState.entry_date, valueState.exit_date])

  useEffect(() => {
    customerRepository
      .getCustomerSearch(`?company_id=${user.company_id}`)
      .then((resp) => {
        setCustomersAll(resp ?? [])
      })
  }, [user.company_id, customerRepository])

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setTimeout(() => {
        updateState({ [name]: value })
      }, 200)
    },
    [updateState]
  )

  const onChangeFunc = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof e.target?.name === 'undefined') return
      const { name, value } = e.target
      updateState({ [name]: (value as any).code })

      if ((value as any).name == 'NIT') {
        setLabels({
          labelNames: 'Razón social',
          labelNoDoc: 'Nit',
          hiddenSurnames: true,
          requiredSurnames: false
        })
      } else {
        setLabels({
          labelNames: 'Nombres',
          labelNoDoc: 'No documento',
          hiddenSurnames: false,
          requiredSurnames: true
        })
      }
    },
    [updateState]
  )

  const onSetValueInit = (val: string) => {
    if (valueState.exit_date !== '' && valueState.exit_date < val) {
      showToast(
        'La fecha de entrada debe ser menor a la fecha de salida',
        'error'
      )
      updateState({ entry_date: '' })
    } else {
      updateState({ entry_date: val })
    }
  }

  const onSetValueEnd = (val: string) => {
    if (valueState.entry_date !== '' && valueState.entry_date > val) {
      showToast(
        'La fecha de salida debe ser mayor a la fecha de entrada',
        'error'
      )
      updateState({ exit_date: '' })
    } else {
      updateState({ exit_date: val })
    }
  }

  const validateCustomerRoom = (rooms_reservations: any[]) => {
    if (
      rooms_reservations.find(
        (reservation) => reservation.guests_rooms.length == 0
      )
    ) {
      showToast(
        'Se debe agregar almenos un huesped en cada una de las habitaciones',
        'error'
      )
      return false
    }
    return true
  }

  const validateRooms = (rooms: any[]) => {
    let row = 1
    for (const room of rooms) {
      if (!room.room) {
        showToast(`Debe seleccionar la habitación en la fila ${row}`, 'error')
        return false
      }
      if (!room.price) {
        showToast(
          `Debe seleccionar el precio de la habitación en la fila ${row}`,
          'error'
        )
        return false
      }
      row++
    }
    return true
  }

  const handleSave = useCallback(
    ({ values, setLoading }: IPropsSave<IBookings & { rooms_reservations: any[] }>) => {
      const data = { ...values, customer_id: valueState.customer_id }
      if (!validateRooms(values.rooms_reservations)) {
        return
      }
      if (
        values.type == 'INGRESO' &&
        !validateCustomerRoom(values.rooms_reservations)
      ) {
        return
      }
      setLoading(true)
      bookingRepository.save(data).then((resp) => {
        setLoading(false)
        if (typeof resp === 'undefined') return
        if (resp.ok) {
          onActionForm?.(resp.data)
          setShowForm(false)
          resetState()
          showToast('Reservación registrada correctamente', 'success')
          return
        }
        showToast(`Error al crear el registro, ${resp.message}`, 'error')
      })
    },
    [bookingRepository, onActionForm, setShowForm, resetState, valueState.customer_id]
  )

  const onSearchCustomer = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target
    setLoading(true)
    const params = createParamsUrl({
      no_document: value,
      company_id: user.company_id
    })
    customerRepository.getCustomerSearch(params).then((resp) => {
      setLoading(false)
      const customer = resp ?? []
      if (customer.length > 0) {
        updateState({
          customer_id: customer[0].customer_id,
          no_document: customer[0].no_document,
          document_type: customer[0].document_type,
          names: customer[0].names,
          surnames: customer[0].surnames,
          cell_phone: customer[0].cell_phone,
          cell_phone_emergency: customer[0].cell_phone_emergency,
          birthdate: customer[0].birthdate
        })
      } else {
        updateState({
          customer_id: 0,
          no_document: value,
          document_type: '',
          names: '',
          surnames: '',
          cell_phone: '',
          cell_phone_emergency: '',
          birthdate: ''
        })
      }
    })
  }

  const getRoomsAvailable = async (): Promise<IRoomAvailability | undefined> => {
    setLoading(true)
    try {
      if (valueState.entry_date === '' || valueState.exit_date === '') {
        return
      }
      const params = createParamsUrl({
        company_id: user.company_id,
        center_id: user.center_id,
        entry_date: valueState.entry_date,
        exit_date: valueState.exit_date
      })

      const resp = await bookingRepository.getRoomAvailability<IRoomAvailability>(params)

      if (resp) {
        setRoomTypes(resp.type_room ?? [])
        setRoomsAll(resp.rooms ?? [])
      }

      return resp
    } finally {
      setLoading(false)
    }
  }

  const addRoom = () => {
    addRoomRowRef.current?.()
  }

  const handleRegisterAddRoom = useCallback((handler: (() => void) | null) => {
    addRoomRowRef.current = handler
  }, [])

  const buttonsAddSection = () => {
    return (
      <div className='flex gap-1'>
        <Button
          type='button'
          icon='pi pi-plus'
          label='Agregar habitación'
          aria-label='Add'
          onClick={addRoom}
        />
      </div>
    )
  }

  const fields: IField[] = useMemo(
    () => [
      {
        type: 'group',
        label: 'Información del Húesped',
        name: 'guest_data1',
        fields: [
          {
            label: 'Tipo identificación',
            name: 'document_type',
            type: 'select',
            placeholder: 'Seleccione',
            onChangeFunc,
            options: DOCUMENT_TYPES
          },
          {
            label: labels.labelNoDoc,
            placeholder: 'Buscar huesped',
            name: 'no_document',
            type: 'text',
            filter: 'no_document',
            onBlur: onSearchCustomer,
            keyfilter: 'int'
          },
          {
            label: labels.labelNames,
            name: 'names',
            type: 'text',
            onBlur
          },
          {
            label: 'Apellidos',
            name: 'surnames',
            type: 'text',
            hidden: labels.hiddenSurnames,
            onBlur
          },
          {
            label: 'Celular',
            name: 'cell_phone',
            type: 'text',
            keyfilter: 'int',
            onBlur
          },
          {
            label: 'Email',
            name: 'email',
            type: 'text',
            keyfilter: 'email',
            onBlur
          }
        ]
      },
      {
        type: 'group',
        label: 'Detalles de la Reservación',
        name: 'guest_data2',
        fields: [
          {
            label: 'Tipo',
            name: 'type',
            type: 'select',
            placeholder: 'Seleccione',
            onChangeFunc,
            options: ACTION_TYPE
          },
          {
            label: 'Fecha de entrada',
            name: 'entry_date',
            type: 'date',
            showTime: true,
            onSetValue: onSetValueInit,
            onCommitValue: getRoomsAvailable
          },
          {
            label: 'Fecha de salida',
            name: 'exit_date',
            type: 'date',
            showTime: true,
            onSetValue: onSetValueEnd,
            onCommitValue: getRoomsAvailable
          },
          {
            label: 'Total días',
            name: 'total_days',
            type: 'text',
            keyfilter: 'int',
            value: valueState.total_days,
            disabled: true,
            style: { width: '10rem' }
          },
          {
            label: 'No personas',
            name: 'number_persons',
            type: 'text',
            keyfilter: 'int',
            style: { width: '10rem' }
          },
          {
            label: 'Observaciones',
            name: 'observations',
            type: 'textArea',
            style: { className: 'w-[98%]' }
          }
        ]
      },
      {
        type: 'section',
        label: 'Reservar habitaciones',
        name: 'guest_data3',
        addButtons: buttonsAddSection,
        component: (
          <AddRoomReservations
            showToast={showToast}
            roomTypes={roomTypes}
            setRoomTypes={setRoomTypes}
            roomsAll={roomsAll}
            setRoomsAll={setRoomsAll}
            dataList={dataList}
            setDataList={setDataList}
            guestRoomList={guestRoomList}
            setGuestRoomList={setGuestRoomList}
            onRegisterAddRow={handleRegisterAddRoom}
          />
        )
      }
    ],
    [
      valueState,
      customersAll,
      onBlur,
      onChangeFunc,
      labels,
      onSetValueInit,
      onSetValueEnd,
      onSearchCustomer,
      roomTypes,
      roomsAll,
      dataList,
      guestRoomList,
      showToast,
      handleRegisterAddRoom
    ]
  )

  const validationSchema = useMemo(
    () =>
      Yup.object({
        document_type: Yup.string().required('Requerido'),
        no_document: Yup.string().required('Requerido'),
        names: Yup.string().min(2, 'Mínimo 2 caracteres').required('Requerido'),
        surnames:
          labels.requiredSurnames == true
            ? Yup.string().min(2, 'Mínimo 2 caracteres').required('Requerido')
            : Yup.string(),
        email: Yup.string().email().required('Requerido'),
        cell_phone: Yup.number().required('Requerido'),
        entry_date: Yup.string().required('Requerido'),
        exit_date: Yup.string()
          .required('Requerido')
          .test(
            'fechas',
            'La fecha de salida debe ser mayor a la fecha de entrada',
            function (value) {
              const { entry_date } = this.parent
              return !entry_date || !value || value > entry_date
            }
          ),
        total_days: Yup.number().min(1, 'Mínimo 1 día').required('Requerido'),
        number_persons: Yup.number()
          .min(1, 'Mínimo 1 persona')
          .required('Requerido'),
        advance_payment_value: Yup.number().required('Requerido'),
        type: Yup.string().required('Requerido')
      }),
    [labels]
  )

  return {
    toast,
    loading,
    handleSave,
    validationSchema,
    fields
  }
}
