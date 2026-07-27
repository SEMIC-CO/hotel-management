import {type Dispatch, type SetStateAction, useCallback, useEffect, useMemo, useState} from 'react'
import {EditList} from '../../components/ui/DataTable/EditList'
import type { IField, IOptionsSelect } from '../../../core/shared/types/forms'
import {useFormikContext} from 'formik'
import type { typeToast } from '../../../core/shared/types/types'
import type { ICustomers } from '../../../core/shared/types/data'
import {AddCustomersRooms} from './AddCustomersRooms'

export interface IReservation {
  key: number
  id?: number
  room_type: string
  room_type_text: string
  room: string
  room_text: string
  price: number
  price_text: string
  action?: string
  room_options?: IOptionsSelect[]
  price_options?: IOptionsSelect[]
  guests_rooms?: ICustomers[]
  disabled_add?: boolean
}

export interface IGuestsRooms extends ICustomers {
  room: number | string
  room_text: string
}

export interface IRoomAvailability {
  rooms: IOptionsSelect[]
  type_room: IOptionsSelect[]
}

interface AddRoomReservationsProps {
  showToast: (message: string, type: typeToast) => void
  roomTypes: IOptionsSelect[]
  setRoomTypes: Dispatch<SetStateAction<IOptionsSelect[]>>
  roomsAll: IOptionsSelect[]
  setRoomsAll: Dispatch<SetStateAction<IOptionsSelect[]>>
  guestRoomList: IGuestsRooms[]
  setGuestRoomList: Dispatch<SetStateAction<IGuestsRooms[]>>
  dataList: IReservation[]
  setDataList: Dispatch<SetStateAction<IReservation[]>>
  onRegisterAddRow?: (addRow: (() => void) | null) => void
}

export const AddRoomReservations = ({
  showToast,
  roomTypes,
  roomsAll,
  dataList,
  setDataList,
  guestRoomList,
  onRegisterAddRow
}: AddRoomReservationsProps) => {
  const [guestRoom, setGuestRoom] = useState<IGuestsRooms | null>(null)
  const [rooms, setRooms] = useState<IOptionsSelect[]>([])

  // Los valores del formulario viven en Formik (este componente se
  // renderiza dentro del arbol del Form). Nada se escribe al store
  // para no reiniciar el formulario en cada cambio.
  const { values, setFieldValue } = useFormikContext<any>()

  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const total = dataList.reduce((acc, item) => {
      if (typeof item.price === 'string') {
        item.price = parseFloat(item.price)
      }
      if (typeof item.price === 'number' && item.price > 0) {
        return acc + item.price
      }
      return acc
    }, 0)
    setFieldValue('rooms_reservations', dataList)
    setFieldValue('total_rooms', total)
    setFieldValue('total_reservation', total * (values.total_days ?? 0))
  }, [dataList, setFieldValue, values.total_days])

  const onChangeRoom = useCallback(
    (e: any, rowData: any) => {
      setDataList((prev) => {
        const exists = prev.some(
          (item) => item.room === e.code && item.key !== rowData.key
        )
        const index = prev.findIndex((item) => item.key === rowData.key)

        if (index === -1) return prev

        if (exists) {
          showToast('La habitación ya está seleccionada', 'warn')
          const newData = [...prev]
          newData[index] = {
            ...newData[index],
            room: '',
            room_text: 'Seleccione aquí..',
            price: 0,
            price_text: 'Seleccione aquí..',
            disabled_add: false,
            price_options: []
          }
          return newData
        }

        const newData = [...prev]
        newData[index] = {
          ...newData[index],
          disabled_add: false,
          price_options: [
            {
              code: e.val_min,
              name: `Valor min: $${Intl.NumberFormat().format(e.val_min)}`
            },
            {
              code: e.val_max,
              name: `Valor max: $${Intl.NumberFormat().format(e.val_max)}`
            }
          ]
        }
        return newData
      })
    },
    [showToast]
  )

  const onChangeTypeRoom = useCallback(
    (e: any, rowData: any) => {
      const roomsFilter = roomsAll.filter(
        (room) => room.id_room_type === e.code
      )
      setDataList((prev) => {
        const index = prev.findIndex((item) => item.key === rowData.key)
        if (index === -1) return prev
        const newData = [...prev]
        newData[index] = {
          ...newData[index],
          room: '',
          room_text: 'Seleccione aquí..',
          price: 0,
          price_text: 'Seleccione aquí..',
          room_options: roomsFilter ?? []
        }
        return newData
      })
    },
    [roomsAll]
  )

  const validateGuestRoom = (
    data: IReservation[],
    documentGuestRoom: string
  ) => {
    for (const reservation of data) {
      if (
        reservation.guests_rooms &&
        reservation.guests_rooms.length > 0 &&
        reservation.guests_rooms.some(
          (guest) => guest.no_document === documentGuestRoom
        )
      ) {
        return true
      }
    }
    return false
  }

  const addCustomersRoom = (row: any) => {
    setRooms(
      dataList.map((item) => ({
        key: item.room,
        name: item.room_text,
        code: item.room
      }))
    )

    if (!validateGuestRoom(dataList, values.no_document)) {
      setGuestRoom({
        room: row.room,
        room_text: row.room_text,
        customer_id: values.customer_id,
        names: values.names,
        surnames: values.surnames,
        document_type: values.document_type,
        no_document: values.no_document,
        email: values.email || '',
        birthdate: values.birthdate || '',
        cell_phone: values.cell_phone,
        cell_phone_emergency: values?.cell_phone_emergency || ''
      })
    }

    setShowForm(true)
  }

  const columns: IField[] = useMemo(
    () =>
      [
        {
          label: 'Tipo de habitación',
          name: 'room_type',
          type: 'select',
          placeholder: 'Seleccione',
          options: roomTypes,
          onChange: onChangeTypeRoom
        },
        {
          label: 'Habitación',
          name: 'room',
          type: 'select',
          placeholder: 'Seleccione',
          options: [],
          onChange: onChangeRoom
        },
        {
          label: 'Precio',
          name: 'price',
          type: 'select',
          placeholder: 'Seleccione el precio',
          options: []
        },
        values.type == 'INGRESO' && {
          header: 'Agregar huesped',
          label: 'Agregar',
          name: 'add',
          type: 'button',
          click: addCustomersRoom
        }
      ].filter(Boolean) as IField[],
    [roomTypes, rooms, onChangeTypeRoom, onChangeRoom, values.type]
  )

  return (
    <div className='block w-full'>
      <AddCustomersRooms
        showForm={showForm}
        setShowForm={setShowForm}
        rooms={rooms}
        guestRoom={guestRoom}
        setData={setDataList}
        data={dataList}
        guestRoomsList={guestRoomList}
      />
      <EditList<IReservation>
        data={dataList}
        setData={setDataList}
        columns={columns}
        onRegisterAddRow={onRegisterAddRow}
      />
      <div
        className='flex justify-start align-items-center gap-4'
        style={{ color: 'var(--primary-color)' }}
      >
        <div>
          <h2 className='font-semibold mt-2'>
            Valor total habitación: $
            {Intl.NumberFormat().format(values.total_rooms ?? 0)}
          </h2>
        </div>
        <div>
          <h2 className='font-semibold mt-2'>
            Valor total reserva: $
            {Intl.NumberFormat().format(values.total_reservation ?? 0)}
          </h2>
        </div>
      </div>
    </div>
  )
}
