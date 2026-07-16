import {create} from 'zustand'
import type { IStore } from '../../core/shared/types/forms'

const valuesEntries = {
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

export const useCustomersStore = create<IStore>()((set) => ({
  values: valuesEntries,
  updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
  resetState: () => set({ values: valuesEntries })
}))
