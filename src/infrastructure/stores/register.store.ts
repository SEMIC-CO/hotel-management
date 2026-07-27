import {create} from 'zustand'
import type { IStore, IOptionsSelect } from '../../core/shared/types/forms'

export interface RegisterFormValues {
  user: {
    names: string
    surnames: string
    cell_phone: string
    email: string
    address: string
    password: string
  }
  company: {
    company_name: string
    nit: string
    email: string
    phone: string
    country: IOptionsSelect | string
    city: IOptionsSelect | string
    address: string
  }
}

export const IvaluesRegister: RegisterFormValues = {
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

export const useRegisterStore = create<IStore<RegisterFormValues>>()((set) => ({
  values: IvaluesRegister,
  updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
  resetState: () => set({ values: IvaluesRegister })
}))
