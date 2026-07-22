import { create } from 'zustand'
// import { IEntries } from '../types/data'
import type { IStore } from '../../core/shared/types/forms'
import dayjs from 'dayjs'

const valuesAdvances = {
    id: '',
    booking_id: '',
    amount: 0,
    payment_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    payment_method: '',
    bank_account_id: '',
    reference: '',
    observations: '',
    status: '',
    created_by: '',
    created_at: '',
    total: 0
}

export const useAdvancesStore = create<IStore>()((set) => ({
    values: valuesAdvances,
    updateState: (newValues) => set((state) => ({ values: { ...state.values, ...newValues } })),
    resetState: () => set({ values: valuesAdvances })
}))
