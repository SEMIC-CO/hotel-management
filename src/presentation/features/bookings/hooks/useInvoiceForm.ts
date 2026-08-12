import { useCallback, useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'
import type {
  IField,
  IOptionsSelect,
  IShow
} from '../../../../core/shared/types/forms'
import { useToast } from '../../../hooks/useToast'
import { useContainer } from '../../../hooks/useContainer'
import { useBookingStore } from '../../../../infrastructure/stores/booking.store'
import { buildCustomerFields } from '../../customers/configCustomerFieldsMode'
import type { IColumns } from '../../../../core/shared/types/datalist'
import { formatCurrency, parseCurrency } from '../../../../core/shared/utils/utils'
import type { ICustomers, IOtherService } from '../../../../core/shared/types/data'
import { getApiErrorMessage } from '../../../../infrastructure/api/client/httpClient'

export const useInvoiceForm = ({
  setShowForm
}: Omit<IShow, 'showForm' | 'onActionForm'>) => {
  const { toast, showToast } = useToast()
  const { invoiceRepository, bookingRepository } = useContainer()

  const [loading, setLoading] = useState(false)
  const [guests, setGuests] = useState<ICustomers[]>([])
  const [holders, setHolders] = useState([])
  const [rooms, setRooms] = useState([])
  const [services, setServices] = useState<IOtherService[]>([])
  const [valuesInvoice, setValuesInvoice] = useState({
    subtotal: 0,
    taxes: 0,
    advances: 0,
    other_services: 0
  })
  const [invoiceTo, setInvoiceTo] = useState('Persona')
  const [paymentMethod, setPaymentMethod] = useState('')

  const valueState = useBookingStore((state) => state.values)
  const updateState = useBookingStore((state) => state.updateState)


  const fetchData = useCallback(async () => {
    try {

      const [otherServices, respListRooms] = await Promise.all([
        bookingRepository.getOtherServices(`?booking_id=${valueState.booking_id}`),
        bookingRepository.getDataEditBookings<any>(`?booking_id=${valueState.booking_id}`)
      ])


      setServices(otherServices.map((service: any) => ({
        ...service,
        unit_value: formatCurrency(service.unit_value),
        total_value: formatCurrency(service.total_value)
      })))

      const totalOtherServices: number = otherServices.reduce((acumulador: number, service: any) => {
        return acumulador + service.total_value
      }, 0)

      const roomsReservations = respListRooms?.rooms_reservations ?? []

      console.log("roomsReservations invoice", roomsReservations);
      console.log("otherServices invoice", otherServices);
      console.log("valueState.value_advance  invoice", valueState.value_advance);


      const listRooms = roomsReservations.map((room: any) => ({
        key: room.rooms_reservations_id,
        room_type: room.room_type_text,
        rooms_reservations_id: room.rooms_reservations_id,
        unit_price: formatCurrency(room.price),
        no_room: room.no_room,
        total: formatCurrency(valueState.total_days * room.price),
        description: `Tipo de habitación ${room.room_type_text} - habitación ${room.no_room}`
      }))
      setRooms(listRooms)

      const total: number = listRooms.reduce((acumulador: number, room: any) => {
        return acumulador + parseCurrency(room.total)
      }, 0)

      setValuesInvoice((prev) => ({
        ...prev,
        advances: valueState.value_advance ?? 0,
        subtotal: total,
        other_services: totalOtherServices,
      }))

      const listGuest = roomsReservations.flatMap(
        (room: any) => room.guests_rooms ?? []
      )

      const listHolders = listGuest.map((guest: any) => ({
        key: guest.customer_id,
        code: guest.customer_id,
        name: `${guest.names} ${guest.surnames}`
      }))

      setGuests(listGuest)
      setHolders(listHolders)
    } catch (error) {
      setRooms([])
      setGuests([])
      setHolders([])
      showToast(
        getApiErrorMessage(error, 'No se pudo cargar la información para facturar.'),
        'error'
      )
    }
  }, [bookingRepository, valueState.booking_id, valueState.total_days, showToast])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const onSelectHolder = (e: IOptionsSelect) => {
    const holderSelect = guests.find(
      (guest) => guest.customer_id == e.value.code
    )
    if (holderSelect) {
      updateState({
        invoice_holder: holderSelect.customer_id,
        customer_name: `${holderSelect.names} ${holderSelect.surnames}`,
        cell_phone: holderSelect.cell_phone,
        customer_id: holderSelect.customer_id,
        no_document: holderSelect.no_document,
        email: holderSelect?.email || ''
      })
    }
  }

  const handleSelectInvoiceTo = useCallback(
    (value: any) => {
      setInvoiceTo(value)
      updateState({
        names: '',
        customer_name: '',
        cell_phone: '',
        customer_id: '',
        no_document: '',
        email: ''
      })
    },
    [updateState]
  )

  const fields = useMemo((): IField[] => {
    const baseField: IField[] = [
      {
        type: 'group',
        label: 'Datos del titular de la factura',
        name: 'detail_titular',
        fields: [
          {
            label: 'Titular de factura',
            name: 'invoice_holder',
            type: 'select',
            placeholder: 'Seleccione',
            options: holders,
            onChangeFunc: onSelectHolder
          }
        ].filter(() => invoiceTo === 'Persona') as IField[]
      },
      {
        type: 'group',
        label: 'Fechas a facturar',
        name: 'fechas',
        fields: [
          {
            label: 'Fecha de entrada',
            name: 'entry_date',
            type: 'date',
            disabled: true,
            showTime: true
          },
          {
            label: 'Fecha de salida',
            name: 'exit_date',
            type: 'date',
            showTime: true
          },
          {
            label: 'Total días',
            name: 'total_days',
            type: 'text',
            keyfilter: 'int',
            disabled: true,
            style: { width: '5rem' }
          }
        ]
      }
    ]

    let getFields = ['no_document', 'cell_phone', 'email']
    if (invoiceTo === 'Empresa') {
      getFields.push('names')
    }

    let fieldsCustomers = buildCustomerFields('in', getFields)
    fieldsCustomers = fieldsCustomers.map((field) => {
      if (field.name === 'names') {
        return { ...field, label: 'Razón social' }
      } else if (field.name === 'no_document') {
        if (invoiceTo === 'Empresa') {
          return {
            ...field,
            label: 'Nit',
            disabled: false,
            width: 'w-52'
          }
        }
        return { ...field, disabled: true }
      } else if (field.name === 'email') {
        return { ...field, width: 'w-52' }
      }
      return field
    })

    baseField[0].fields = [...(baseField[0].fields ?? []), ...fieldsCustomers]
    return baseField
  }, [holders, invoiceTo])



  const handleSave = useCallback(
    async (data: any) => {
      const { values, setLoading } = data

      if (paymentMethod === '') {
        showToast('Seleccione un método de pago', 'error')
        return
      }

      const invoiceData = {
        booking_id: values.booking_id,
        company_id: values.company_id,
        center_id: values.center_id,
        created_by: values.created_by,
        customer_id: values.customer_id,
        invoice_to: invoiceTo,
        customer_name: values.names,
        cell_phone: values.cell_phone,
        no_document: values.no_document,
        email: values.email,
        entry_date: values.entry_date,
        exit_date: values.exit_date,
        total_days: values.total_days,
        invoice_number: '',
        invoice_date: '',
        payment_method: paymentMethod,
        subtotal: valuesInvoice.subtotal,
        taxes: valuesInvoice.taxes,
        advances: valuesInvoice.advances,
        other_services: valuesInvoice.other_services,
        total:
          valuesInvoice.subtotal +
          valuesInvoice.taxes +
          valuesInvoice.other_services,
        status: 'PENDIENTE',
        details: rooms
      }

      setLoading(true)
      try {
        const resp = await invoiceRepository.save(invoiceData as any)
        if (resp.ok) {
          showToast('Factura generada correctamente', 'success')
          setShowForm(false)
          return
        }
        showToast(resp.message || 'Error al generar la factura', 'error')
      } catch (error) {
        showToast(
          getApiErrorMessage(error, 'No se pudo generar la factura.'),
          'error'
        )
      } finally {
        setLoading(false)
      }
    },
    [invoiceRepository, invoiceTo, paymentMethod, rooms, valuesInvoice, setShowForm, showToast]
  )

  const validationSchema = useMemo(
    () =>
      Yup.object({
        names:
          invoiceTo === 'Empresa'
            ? Yup.string().required('Requerido')
            : Yup.string(),
        no_document: Yup.string().required('Requerido'),
        cell_phone: Yup.number().required('Requerido'),
        email: Yup.string().email('Email no válido').required('Requerido')
      }),
    [invoiceTo]
  )

  const close = useCallback(() => {
    setLoading(false)
    setShowForm(false)
  }, [setShowForm])

  const columns: IColumns[] = useMemo(
    () => [
      { label: 'Tipo de habitación', name: 'room_type' },
      { label: 'Habitación', name: 'no_room' },
      { label: 'Precio', name: 'unit_price' },
      { label: 'Total', name: 'total' }
    ],
    []
  )

  return {
    toast,
    loading,
    invoiceTo,
    setInvoiceTo,
    paymentMethod,
    setPaymentMethod,
    valuesInvoice,
    rooms,
    columns,
    fields,
    validationSchema,
    handleSave,
    handleSelectInvoiceTo,
    close,
    services
  }
}
