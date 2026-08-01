import {create} from 'zustand'
// import { IEntries } from '../types/data'
import type { IStore } from '../../core/shared/types/forms'

const valuesUsers = {
  key: 0,
  user_id: 0,
  names: '',
  surnames: '',
  email: '',
  username: '',
  cell_phone: '',
  address: '',
  state: 'Activo',
  profile_id: 0,
  company_id: 0,
  center_id: 0
}

export type UsersFormValues = typeof valuesUsers

export const useUsersStore = create<IStore<UsersFormValues>>()((set) => ({
  values: valuesUsers,
  updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
  resetState: () => set({ values: valuesUsers })
}))
