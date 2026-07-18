import { useCallback, useEffect, useState } from 'react'
import { useContainer } from '../../../hooks/useContainer'
import { useList } from '../../../hooks/useList'
import { createParamsUrl } from '../../../../core/shared/utils/utils'
import type { IBookings } from '../../../../core/shared/types/data'
import { useBookingStore } from '../../../../infrastructure/stores/booking.store'
import { useAdvancesStore } from '../../../../infrastructure/stores/advances.store'

export const useBookingsList = () => {
  const { bookingRepository } = useContainer()
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
    user,
    action,
    setAction
  } = useList<IBookings>()

  const [showFormInvoice, setShowFormInvoice] = useState(false)
  const [showFormAdvance, setShowFormAdvance] = useState(false)
  const { updateState } = useBookingStore()
  const updateStateAdvance = useAdvancesStore(state => state.updateState)

  const refreshList = useCallback(() => {
    setLoading(true)
    const params = {
      company_id: user.company_id,
      center_id: user.center_id
    }
    const urlParams = createParamsUrl(params)
    bookingRepository
      .get(urlParams)
      .then((resp) => {
        setData(resp ?? [])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user.company_id, user.center_id, bookingRepository, setData, setLoading])

  useEffect(() => {
    refreshList()
  }, [refreshList])

  const update = useCallback(
    (row: IBookings) => {
      setShowForm(true)
      setAction('edit')
      updateState(row)
    },
    [setShowForm, setAction, updateState]
  )

  const onFormInvoice = useCallback(
    (row: IBookings) => {
      setShowFormInvoice(true)
      updateState(row)
    },
    [updateState]
  )

  const onFormAdvance = useCallback(
    (row: IBookings) => {
      console.log("onFormAdvance Bookings", row);
      
      setShowFormAdvance(true)
      updateStateAdvance({
        booking_id: row.booking_id,
        total_reservation: row.total_reservation,
        payment_date: new Date()
      })
    },

    [updateStateAdvance]
  )

  const onActionForm = useCallback(() => {
    refreshList()
  }, [refreshList])

  const confirmReservation = useCallback(
    (row: IBookings) => {
      bookingRepository
        .confirmReservation(row.booking_id)
        .then(() => {
          toast.current?.show({
            severity: 'success',
            summary: 'Reserva confirmada',
            detail: `Reserva ${row.booking_id} confirmada exitosamente`
          })
          refreshList()
        })
        .catch(() => {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: `No se pudo confirmar la reserva ${row.booking_id}`
          })
        })
    },
    [bookingRepository, toast, refreshList]
  )

  const cancelReservation = useCallback(
    (row: IBookings) => {
      bookingRepository
        .cancelReservation(row.booking_id)
        .then(() => {
          toast.current?.show({
            severity: 'success',
            summary: 'Reserva cancelada',
            detail: `Reserva ${row.booking_id} cancelada exitosamente`
          })
          refreshList()
        })
        .catch(() => {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: `No se pudo cancelar la reserva ${row.booking_id}`
          })
        })
    },
    [bookingRepository, toast, refreshList]
  )

  const columns = [
    { label: 'Id', name: 'booking_id', filter: true, sort: true, width: '2rem' },
    { label: 'Habitacion', name: 'no_room', width: '10rem', type: 'tag, tooltip' },
    { label: 'No Documento', name: 'no_document', filter: true, sort: true, width: '10rem' },
    { label: 'Cliente', name: 'customer_name', type: 'text', filter: true, sort: true, width: '10rem' },
    { label: 'Fecha Entrada', name: 'entry_date', filter: true, sort: true, width: '15rem' },
    { label: 'Fecha Salida', name: 'exit_date', filter: true, sort: true, width: '15rem' },
    { label: 'Días', name: 'total_days', sort: true, width: '5rem' },
    { label: 'Total reserva', name: 'total_reservation', type: 'money', filter: true, sort: true, width: '10rem' },
    { label: 'Estado', name: 'state', filter: true, sort: true, width: '10rem', type: 'tag' },
    { label: 'Observaciones', name: 'observations', type: 'tooltip' },
    { label: 'No Factura', name: 'invoice_number', type: 'tooltip', width: '10rem' },
    { label: 'Tipo', name: 'type', filter: true, sort: true, width: '10rem' }
  ]

  return {
    data,
    loading,
    showForm,
    setShowForm,
    selectedRow,
    setSelectedRow,
    showFormInvoice,
    setShowFormInvoice,
    showFormAdvance,
    setShowFormAdvance,
    action,
    setAction,
    columns,
    update,
    onFormInvoice,
    onFormAdvance,
    onActionForm,
    confirmReservation,
    cancelReservation,
    refreshList,
    toast
  }
}
