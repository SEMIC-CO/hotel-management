import {create} from 'zustand'
import type { IStore } from '../../core/shared/types/forms'

const valuesCenters = {
  center_name: '',
  address: '',
  phone: '',
  city: ''
}

export type CentersFormValues = typeof valuesCenters

export const useCentersStore = create<IStore<CentersFormValues>>()((set) => ({
  values: valuesCenters,
  updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
  resetState: () => set({ values: valuesCenters })
}))
