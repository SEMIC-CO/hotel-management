import {create} from 'zustand'
import type { IStore } from '../../core/shared/types/forms'
// import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'

const valuesSession = {
  isAuthenticated: false,
  user: undefined
}

// const customSessionStorage: StateStorage = {
//   getItem: function (name: string): string | null | Promise<string | null> {
//     const data = sessionStorage.getItem(name)
//     return data
//   },
//   setItem: function (name: string, value: string): void | Promise<void> {
//     sessionStorage.setItem(name, value)
//   },
//   removeItem: function (name: string): void | Promise<void> {
//     sessionStorage.removeItem(name)
//   }
// }
// export const useSessionStore = create<IStore>()(
//   persist(
//     (set) => ({
//       values: valuesSession,
//       updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
//       resetState: () => set({ values: valuesSession })
//     }),
//     {
//       name: 'auth-store',
//       storage: createJSONStorage(() => customSessionStorage)
//     }
//   )
export const useSessionStore = create<IStore>()((set) => ({
  values: valuesSession,
  updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
  resetState: () => set({ values: valuesSession })
}))
