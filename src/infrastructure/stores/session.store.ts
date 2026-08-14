import {create} from 'zustand'
import type { IStore } from '../../core/shared/types/forms'
import type { ISession } from '../../core/shared/types/data'

const valuesSession: ISession = {
  isAuthenticated: false,
  user: undefined,
}

export const useSessionStore = create<IStore<ISession>>()((set) => ({
  values: valuesSession,
  updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
  resetState: () => set({ values: valuesSession })
}))