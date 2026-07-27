import {create} from 'zustand'
import type { IStore } from '../../core/shared/types/forms'

const valuesRooms = {
  description: '',
  fecha: '',
  no_room: '',
  room_id: 0,
  val_min: '',
  val_max: '',
  state: '',
  type: ''
}
export type BedroomsFormValues = typeof valuesRooms

export const useBedroomsStore = create<IStore<BedroomsFormValues>>()((set) => ({
  values: valuesRooms,
  updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
  resetState: () => set({ values: valuesRooms })
}))
