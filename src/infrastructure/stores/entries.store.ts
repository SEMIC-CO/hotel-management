import {create} from 'zustand'
// import { IEntries } from '../types/data'
import type { IStore } from '../../core/shared/types/forms'

const valuesEntries = {
  entry_id: 0,
  room_id: '',
  no_document: 0,
  names: '',
  customer: '',
  customer_id: 0,
  entry_date: '',
  exit_date: '',
  total_days: 0,
  val_room: 0,
  val_day: 0,
  total_amount_pay: 0,
  status: ''
}
export const useEntriesStore = create<IStore>()((set) => ({
  values: valuesEntries,
  updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
  resetState: () => set({ values: valuesEntries })
}))
