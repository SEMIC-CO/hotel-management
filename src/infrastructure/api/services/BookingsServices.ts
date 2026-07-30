import type { IBookingRepository } from '../../../core/domain/repositories'
import type {
  IBookings,
  ICalendarReservation,
  IOtherServicesPayload
} from '../../../core/shared/types/data'
import type { IRespSuccess } from '../../../core/shared/types/forms'
import { BOOKING_STATE } from '../../../core/shared/utils/constants'
import { requestApi } from '../client/apiRequest'
import type { HttpMethod } from '../client/httpClient'

interface Body {
  data?: IBookings[]
}
interface BodyRoom<T> {
  data?: T
}
interface BodyOtherServices {
  data?: unknown
}

class BookingsServices implements IBookingRepository {
  get = async (params = '') => {
    const body = await requestApi<Body>(`reservations${params}`, [], 'GET')
    return body.data ?? []
  }

  getRoomAvailability = async <T>(params = '') => {
    const body = await requestApi<BodyRoom<T>>(
      `reservations/rooms_available${params}`,
      [],
      'GET'
    )
    return body.data
  }

  getDataEditBookings = async <T>(params = '') => {
    const body = await requestApi<BodyRoom<T>>(
      `reservations/edit_booking${params}`,
      [],
      'GET'
    )
    return body.data
  }

  getCalendarReservations = async (params = '') => {
    const body = await requestApi<BodyRoom<ICalendarReservation[]>>(
      `reservations/calendar${params}`,
      [],
      'GET'
    )
    return body.data ?? []
  }

  save = async (data: IBookings) => {
    let service = 'reservations'
    let method: HttpMethod = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `reservations/${data.key}`
      method = 'PATCH'
    }
    return requestApi<Body & IRespSuccess>(service, { ...data }, method)
  }

  saveAdvance = async (data: IBookings) => {
    let service = 'advancePayments'
    let method: HttpMethod = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `advancePayments/${data.key}`
      method = 'PATCH'
    }
    return requestApi<Body & IRespSuccess>(service, { ...data }, method)
  }

  saveOtherServices = async (data: IOtherServicesPayload) => {
    let service = 'otherServices'
    let method: HttpMethod = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `otherServices/${data.key}`
      method = 'PATCH'
    }
    return requestApi<BodyOtherServices & IRespSuccess>(
      service,
      { ...data },
      method
    )
  }

  confirmReservation = async (booking_id: number) => {
    return requestApi<IRespSuccess>(
      `reservations/confirm/${booking_id}`,
      { state: BOOKING_STATE.RESERVADA },
      'PATCH'
    )
  }

  cancelReservation = async (booking_id: number) => {
    return requestApi<IRespSuccess>(
      `reservations/cancel/${booking_id}`,
      { state: BOOKING_STATE.CANCELADA },
      'PATCH'
    )
  }
}

export const bookings = new BookingsServices()
export default bookings
