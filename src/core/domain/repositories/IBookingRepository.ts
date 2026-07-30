import type {
  IBookings,
  ICalendarReservation,
  IOtherServicesPayload
} from '../../shared/types/data'
import type { IRespSuccess } from '../../shared/types/forms'

export interface IBookingRepository {
  get: (params?: string) => Promise<IBookings[]>
  getRoomAvailability: <T>(params?: string) => Promise<T | undefined>
  getDataEditBookings: <T>(params?: string) => Promise<T | undefined>
  getCalendarReservations: (params?: string) => Promise<ICalendarReservation[]>
  save: (data: IBookings) => Promise<Body & IRespSuccess>
  saveAdvance: (data: IBookings) => Promise<Body & IRespSuccess>
  saveOtherServices: (data: IOtherServicesPayload) => Promise<BodyOtherServices & IRespSuccess>
  confirmReservation: (booking_id: number) => Promise<IRespSuccess>
  cancelReservation: (booking_id: number) => Promise<IRespSuccess>
}

interface Body {
  data?: IBookings[]
}

interface BodyOtherServices {
  data?: unknown
}
