import { create } from 'zustand'
// import { IEntries } from '../types/data'
import type { IStore } from '../../core/shared/types/forms'
import dayjs from 'dayjs'

const valuesOthers = {
    id: '',
    booking_id: '',
    service_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    service_name: '',
    quantity: 1,
    unit_value: 0,
    total_value: 0,
    observations: '',
    created_by: '',
    created_at: ''
}

export const useOtherServicesStore = create<IStore>()((set) => ({
    values: valuesOthers,
    updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
    resetState: () => set({ values: valuesOthers })
}))
