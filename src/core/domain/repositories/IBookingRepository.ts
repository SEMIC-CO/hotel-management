import type { IBookings } from '../../shared/types/data'
import type { IRespSuccess } from '../../shared/types/forms'

export interface IBookingRepository {
  get: (params?: string) => Promise<IBookings[] | undefined>
  getRoomAvailability: <T>(params?: string) => Promise<T | undefined>
  getDataEditBookings: <T>(params?: string) => Promise<T | undefined>
  getCalendarReservations: (params?: string) => Promise<any | undefined>
  save: (data: IBookings) => Promise<(Body & IRespSuccess) | undefined>
  saveAdvance: (data: IBookings) => Promise<(Body & IRespSuccess) | undefined>
  confirmReservation: (booking_id: number) => Promise<IRespSuccess | undefined>
  cancelReservation: (booking_id: number) => Promise<IRespSuccess | undefined>
}

interface Body {
  data?: IBookings[]
}
