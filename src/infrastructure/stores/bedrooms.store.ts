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
export const useBedroomsStore = create<IStore>()((set) => ({
  values: valuesRooms,
  updateState: (newValues) => set(({ values: { ...newValues, ...newValues } })),
  resetState: () => set({ values: valuesRooms })
}))
