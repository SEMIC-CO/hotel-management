import {create} from 'zustand'
// import { IEntries } from '../types/data'
import type { IStore } from '../../core/shared/types/forms'

const valuesUsers = {
  user_id: 0,
  names: '',
  surnames: '',
  email: '',
  cell_phone: '',
  entry_date: '',
  address: '',
  state: '',
  profile_id: 0,
  company_id: 0,
  center_id: 0
}
export const useUsersStore = create<IStore>()((set) => ({
  values: valuesUsers,
  updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
  resetState: () => set({ values: valuesUsers })
}))
