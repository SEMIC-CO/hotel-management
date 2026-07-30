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
import { getApiErrorMessage } from '../../../../infrastructure/api/client/httpClient'

interface IEntryExitDates {
  entry_date: string
  exit_date: string
}

// Calcula total_dias y total_reservation directamente en Formik.
// formik.values puede no tener aun la fecha que se acaba de cambiar,
// por eso las fechas se reciben como argumentos.
const setTotalsByDates = (formik: any, entryDate: string, exitDate: string) => {
  if (entryDate === '' || exitDate === '') {
    formik.setFieldValue('total_days', 0)
    formik.setFieldValue('total_reservation', 0)
    return
  }
  let days = dayjs(exitDate).diff(dayjs(entryDate), 'days')
  days = days === 0 ? 1 : days
  formik.setFieldValue('total_days', days)
  formik.setFieldValue('total_reservation', days * (formik.values.total_rooms ?? 0))
}

export const useBookingForm = ({
  onActionForm,
  setShowForm,
  action
}: Omit<IShow, 'showForm'> & { action?: 'add' | 'edit' }) => {
  const [customersAll, setCustomersAll] = useState<ISearch[]>([])
  const { toast, showToast } = useToast()
  const { bookingRepository, customerRepository } = useContainer()
  const [loading, setLoading] = useState(false)

  // El store solo se usa para la carga inicial del editar (booking_id)
  // y para resetear al guardar/cerrar. Durante la edicion Formik es el
  // dueno de los valores, asi ningun update reinicia el formulario.
  const booking_id = useBookingStore((state) => state.values.booking_id)
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

  const getRoomsAvailable = useCallback(
    async (dates?: IEntryExitDates): Promise<IRoomAvailability | undefined> => {
      // Sin fechas explicitas se toman del store (carga inicial del editar)
      const { entry_date, exit_date } = dates ?? useBookingStore.getState().values
      if (entry_date === '' || exit_date === '' || exit_date < entry_date) {
        return
      }
      setLoading(true)
      try {
        const params = createParamsUrl({
          company_id: user.company_id,
          center_id: user.center_id,
          entry_date,
          exit_date
        })

        const resp = await bookingRepository.getRoomAvailability<IRoomAvailability>(params)

        if (resp) {
          setRoomTypes(resp.type_room ?? [])
          setRoomsAll(resp.rooms ?? [])
        }

        return resp
      } catch (error) {
        showToast(
          getApiErrorMessage(error, 'No se pudo consultar la disponibilidad.'),
          'error'
        )
        return undefined
      } finally {
        setLoading(false)
      }
    },
    [bookingRepository, user.company_id, user.center_id, showToast]
  )

  // Al ocultarse el calendario se consulta disponibilidad. Se usa el valor
  // recibido para la fecha del campo y formik.values para la otra fecha.
  const onCommitEntry = useCallback(
    (val: string, formik: any) => {
      getRoomsAvailable({ ...formik.values, entry_date: val })
    },
    [getRoomsAvailable]
  )

  const onCommitExit = useCallback(
    (val: string, formik: any) => {
      getRoomsAvailable({ ...formik.values, exit_date: val })
    },
    [getRoomsAvailable]
  )

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
      `?booking_id=${booking_id}`
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
    const fetchData = async () => {
      if (action !== 'edit') {
        setDataList([])
        setRoomsAll([])
        setGuestRoomList([])
        return
      }
      try {
        await fetchDataEdit()
      } catch (error) {
        showToast(
          getApiErrorMessage(error, 'No se pudo cargar la información de la reserva.'),
          'error'
        )
      }
    }
    void fetchData()
  }, [action, booking_id])

  useEffect(() => {
    customerRepository
      .getCustomerSearch(`?company_id=${user.company_id}`)
      .then((resp) => {
        setCustomersAll(resp ?? [])
      })
      .catch((error) => {
        setCustomersAll([])
        showToast(
          getApiErrorMessage(error, 'No se pudo cargar la lista de huéspedes.'),
          'error'
        )
      })
  }, [user.company_id, customerRepository, showToast])

  const onChangeFunc = useCallback((e: any) => {
    if (typeof e.target?.name === 'undefined') return
    const { value } = e.target

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
  }, [])

  const onSetValueInit = useCallback(
    (val: string, formik: any) => {
      const exitDate: string = formik.values.exit_date ?? ''
      if (exitDate !== '' && exitDate < val) {
        showToast(
          'La fecha de entrada debe ser menor a la fecha de salida',
          'error'
        )
        formik.setFieldValue('entry_date', '')
        setTotalsByDates(formik, '', exitDate)
        return
      }
      setTotalsByDates(formik, val, exitDate)
    },
    [showToast]
  )

  const onSetValueEnd = useCallback(
    (val: string, formik: any) => {
      const entryDate: string = formik.values.entry_date ?? ''
      if (entryDate !== '' && entryDate > val) {
        showToast(
          'La fecha de salida debe ser mayor a la fecha de entrada',
          'error'
        )
        formik.setFieldValue('exit_date', '')
        setTotalsByDates(formik, entryDate, '')
        return
      }
      setTotalsByDates(formik, entryDate, val)
    },
    [showToast]
  )

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
      const data = { ...values }
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
      bookingRepository
        .save(data)
        .then((resp) => {
          if (resp.ok) {
            onActionForm?.(resp.data)
            setShowForm(false)
            resetState()
            showToast('Reservación registrada correctamente', 'success')
            return
          }
          showToast(
            `Error al crear el registro, ${resp.message ?? 'intente nuevamente'}`,
            'error'
          )
        })
        .catch((error) => {
          showToast(
            getApiErrorMessage(error, 'No se pudo guardar la reservación.'),
            'error'
          )
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [bookingRepository, onActionForm, setShowForm, resetState, showToast]
  )

  const onSearchCustomer = useCallback(
    (e: React.FocusEvent<HTMLInputElement>, formik: any) => {
      const { value } = e.target
      setLoading(true)
      const params = createParamsUrl({
        no_document: value,
        company_id: user.company_id
      })
      customerRepository
        .getCustomerSearch(params)
        .then((resp) => {
          const customer = resp ?? []
          // setFieldValue campo a campo: no pisa lo que el usuario
          // este digitando en otros campos mientras llega la respuesta
          if (customer.length > 0) {
            formik.setFieldValue('customer_id', customer[0].customer_id)
            formik.setFieldValue('no_document', customer[0].no_document)
            formik.setFieldValue('document_type', customer[0].document_type)
            formik.setFieldValue('names', customer[0].names)
            formik.setFieldValue('surnames', customer[0].surnames)
            formik.setFieldValue('cell_phone', customer[0].cell_phone)
            formik.setFieldValue('cell_phone_emergency', customer[0].cell_phone_emergency)
            formik.setFieldValue('birthdate', customer[0].birthdate)
          } else {
            formik.setFieldValue('customer_id', 0)
            formik.setFieldValue('no_document', value)
            formik.setFieldValue('document_type', '')
            formik.setFieldValue('names', '')
            formik.setFieldValue('surnames', '')
            formik.setFieldValue('cell_phone', '')
            formik.setFieldValue('cell_phone_emergency', '')
            formik.setFieldValue('birthdate', '')
          }
        })
        .catch((error) => {
          showToast(
            getApiErrorMessage(error, 'No se pudo consultar el huésped.'),
            'error'
          )
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [customerRepository, user.company_id, showToast]
  )

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
            type: 'text'
          },
          {
            label: 'Apellidos',
            name: 'surnames',
            type: 'text',
            hidden: labels.hiddenSurnames
          },
          {
            label: 'Celular',
            name: 'cell_phone',
            type: 'text',
            keyfilter: 'int'
          },
          {
            label: 'Email',
            name: 'email',
            type: 'text',
            keyfilter: 'email'
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
            onCommitValue: onCommitEntry
          },
          {
            label: 'Fecha de salida',
            name: 'exit_date',
            type: 'date',
            showTime: true,
            onSetValue: onSetValueEnd,
            onCommitValue: onCommitExit
          },
          {
            label: 'Total días',
            name: 'total_days',
            type: 'text',
            keyfilter: 'int',
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
      customersAll,
      onChangeFunc,
      labels,
      onSetValueInit,
      onSetValueEnd,
      onCommitEntry,
      onCommitExit,
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
