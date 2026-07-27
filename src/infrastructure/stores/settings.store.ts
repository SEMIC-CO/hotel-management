import {create} from 'zustand'
import type { IStore } from '../../core/shared/types/forms'

const valuesProfiles = {
  profile: '',
  type: ''
}

export type ProfilesFormValues = typeof valuesProfiles

export const useProfilesStore = create<IStore<ProfilesFormValues>>()((set) => ({
  values: valuesProfiles,
  updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
  resetState: () => set({ values: valuesProfiles })
}))

const valuesBanksAccounts = {
  bank_account_id: '',
  number_accounts: '',
  type: '',
  bank_id: 0
}

export type BanksAccountsFormValues = typeof valuesBanksAccounts

export const useBanksAccountsStore = create<IStore<BanksAccountsFormValues>>()((set) => ({
  values: valuesBanksAccounts,
  updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
  resetState: () => set({ values: valuesBanksAccounts })
}))

const valuesTypeRoom = {
  id_room_type: '',
  name: '',
  type: '',
  company_id: 0,
  center_id: 0,
  created_by: 0
}

export type TypeRoomFormValues = typeof valuesTypeRoom

export const useTypeRoomStore = create<IStore<TypeRoomFormValues>>()((set) => ({
  values: valuesTypeRoom,
  updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
  resetState: () => set({ values: valuesTypeRoom })
}))
