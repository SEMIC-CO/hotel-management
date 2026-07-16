import {create} from 'zustand'
import type { IStore } from '../../core/shared/types/forms'

export const IvaluesRegister = {
  user: {
    names: '',
    surnames: '',
    cell_phone: '',
    email: '',
    address: '',
    password: ''
  },
  company: {
    company_name: '',
    nit: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address: ''
  }
}

export const useRegisterStore = create<IStore>()((set) => ({
  values: IvaluesRegister,
  updateState: (newValues) => set(({ values: { ...newValues, ...newValues } })),
  resetState: () => set({ values: IvaluesRegister })
}))
