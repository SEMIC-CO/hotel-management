import {create} from 'zustand'
import type { IStore } from '../../core/shared/types/forms'

const valuesCenters = {
  center_name: '',
  address: '',
  phone: '',
  city: ''
}

export const useCentersStore = create<IStore>()((set) => ({
  values: valuesCenters,
  updateState: (newValues) => set({ values: { ...newValues, ...newValues } }),
  resetState: () => set({ values: valuesCenters })
}))
