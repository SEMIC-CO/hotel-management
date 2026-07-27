import {create} from 'zustand'
import type { IStore } from '../../core/shared/types/forms'

const valuesCustomers = {
  customer_id: 0,
  names: '',
  surnames: '',
  document_type: '',
  no_document: '',
  birthdate: '',
  email: '',
  cell_phone: '',
  cell_phone_emergency: '',
  room: ''
}

export type CustomersFormValues = typeof valuesCustomers

export const useCustomersStore = create<IStore<CustomersFormValues>>()((set) => ({
  values: valuesCustomers,
  updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
  resetState: () => set({ values: valuesCustomers })
}))
