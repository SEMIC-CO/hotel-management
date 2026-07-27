import {create} from 'zustand'
import type { IStore } from '../../core/shared/types/forms'
import type { IRoomsBookings } from '../../core/shared/types/data'

const valuesBookings = {
  booking_id: 0,
  customer_id: 0,
  customer_name: '',
  invoice_holder: 0,
  document_type: '',
  no_document: '',
  names: '',
  surnames: '',
  birthdate: '',
  cell_phone: '',
  cell_phone_emergency: '',
  email: '',
  type: '',
  entry_date: '',
  exit_date: '',
  total_days: 0,
  number_persons: 1,
  observations: '',
  rooms_reservations: [] as IRoomsBookings[],
  total_rooms: 0,
  total_reservation: 0,
  advance_payment_value: 0,
  payment_type: '',
  bank: ''
}

export type BookingFormValues = typeof valuesBookings

export const useBookingStore = create<IStore<BookingFormValues>>()((set) => ({
  values: valuesBookings,
  updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
  resetState: (newValues) => set({ values: (newValues as BookingFormValues) || valuesBookings })
}))
