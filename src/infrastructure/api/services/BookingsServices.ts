import type { IBookingRepository } from '../../../core/domain/repositories'
import type { IBookings } from '../../../core/shared/types/data'
import type { IRespSuccess } from '../../../core/shared/types/forms'
import {useFetch} from '../client/httpClient'
import {validateSession} from '../../auth/sessionManager'
interface Body {
  data?: IBookings[]
}
interface BodyRoom<T> {
  data?: T
}

class BookingsServices implements IBookingRepository {
  get = async (params = '') => {
    const resp = await useFetch(`reservations${params}`, [], 'GET')
    await validateSession(resp)
    const body: Body = (await resp.json()) as Body
    if (resp.ok) {
      return body.data
    }
    return []
  }

  getRoomAvailability = async <T>(params = '') => {
    const resp = await useFetch(`reservations/rooms_available${params}`, [], 'GET')
    await validateSession(resp)
    const body: BodyRoom<T> = (await resp.json()) as BodyRoom<T>
    if (resp.ok) {
      return body.data
    }
    return undefined
  }

  getDataEditBookings = async <T>(params = '') => {
    const resp = await useFetch(`reservations/edit_booking${params}`, [], 'GET')
    await validateSession(resp)
    if (resp.status === 401) {
      console.log('Cerrar sesion')
    }
    const body: BodyRoom<T> = (await resp.json()) as BodyRoom<T>
    if (resp.ok) {
      return body.data
    }
    return undefined
  }

  getCalendarReservations = async (params = '') => {
    const resp = await useFetch(`reservations/calendar${params}`, [], 'GET')
    await validateSession(resp)
    if (resp.status === 401) {
      console.log('Cerrar sesion')
    }
    const body: BodyRoom<any> = (await resp.json()) as BodyRoom<any>
    if (resp.ok) {
      return body.data
    }
    return undefined
  }

  save = async (data: IBookings) => {
    let service = 'reservations'
    let method = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `reservations/${data.key}`
      method = 'PATCH'
    }
    const resp = await useFetch(service, { ...data }, method)
    await validateSession(resp)
    const body = (await resp.json()) as Body & IRespSuccess
    if (resp.ok) {
      return body
    }
  }

  saveAdvance = async (data: IBookings) => {
    let service = 'advancePayments'
    let method = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `advancePayments/${data.key}`
      method = 'PATCH'
    }
    const resp = await useFetch(service, { ...data }, method)
    await validateSession(resp)
    const body = (await resp.json()) as Body & IRespSuccess
    if (resp.ok) {
      return body
    }
  }

  confirmReservation = async (booking_id: number) => {
    const resp = await useFetch(`reservations/confirm/${booking_id}`, { state: 'RESERVADA' }, 'PATCH')
    await validateSession(resp)
    const body = (await resp.json()) as IRespSuccess
    if (resp.ok) {
      return body
    }
  }

  cancelReservation = async (booking_id: number) => {
    const resp = await useFetch(`reservations/cancel/${booking_id}`, { state: 'CANCELADA' }, 'PATCH')
    await validateSession(resp)
    const body = (await resp.json()) as IRespSuccess
    if (resp.ok) {
      return body
    }
  }
}

export const bookings = new BookingsServices()
export default bookings
