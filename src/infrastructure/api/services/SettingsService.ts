import type { ISettingsRepository } from '../../../core/domain/repositories'
import type { IBanksAccount, ICenters, IProfiles, IRoomType, IUsers } from '../../../core/shared/types/data'
import type { IOptionsSelect, IRespSuccess } from '../../../core/shared/types/forms'
import {useFetch} from '../client/httpClient'
import {validateSession} from '../../auth/sessionManager'

interface Options {
  data?: IOptionsSelect[]
}
interface IBody<T> {
  data: T
}
interface BodyCenters {
  data?: ICenters[]
}
interface BodyUsers {
  data?: IUsers[]
}
interface BodyProfiles {
  data?: IProfiles[]
}
interface BodyBanksAccounts {
  data?: IBanksAccount[]
}
interface BodyTypeRooms {
  data?: IRoomType[]
}

class SettingsService implements ISettingsRepository {
  getRoomTypes = async (params = '') => {
    const resp = await useFetch(`tipohabitacion${params}`, [], 'GET')
    await validateSession(resp)
    const body = (await resp.json()) as Options
    if (resp.ok) {
      return body.data
    }
  }

  getCenters = async (params = '') => {
    const resp = await useFetch(`centers${params}`, [], 'GET')
    await validateSession(resp)
    const body = (await resp.json()) as Options | BodyCenters
    if (resp.ok) {
      return body.data
    }
  }

  getUsers = async (params = '') => {
    const resp = await useFetch(`usuarios${params}`, [], 'GET')
    await validateSession(resp)
    const body = (await resp.json()) as Options | BodyUsers
    if (resp.ok) {
      return body.data
    }
  }

  getProfiles = async (params = '') => {
    const resp = await useFetch(`perfiles${params}`, [], 'GET')
    await validateSession(resp)
    const body = (await resp.json()) as BodyProfiles | Options
    if (resp.ok) {
      return body.data
    }
  }

  getCities = async (params = '') => {
    const resp = await useFetch(`location/cities${params}`, [], 'GET')
    await validateSession(resp)
    const body = (await resp.json()) as Options
    if (resp.ok) {
      return body.data
    }
  }

  getBanks = async (params = '') => {
    const resp = await useFetch(`banks/${params}`, [], 'GET')
    await validateSession(resp)
    const body = (await resp.json()) as Options | BodyProfiles
    if (resp.ok) {
      return body.data
    }
  }

  getBanksAccounts = async<T>(params = '') => {
    const resp = await useFetch(`bankAccounts/${params}`, [], 'GET')
    await validateSession(resp)
    const body = (await resp.json()) as IBody<T>
    if (resp.ok) {
      return body.data
    }
  }

  getRoomsType = async (params = '') => {
    const resp = await useFetch(`tipohabitacion/${params}`, [], 'GET')
    await validateSession(resp)
    const body = (await resp.json()) as Options | BodyTypeRooms
    if (resp.ok) {
      return body.data
    }
  }

  getSequences = async (params = '') => {
    const resp = await useFetch(`invoiceSequences${params}`, [], 'GET')
    await validateSession(resp)
    const body = (await resp.json()) as Options | BodyCenters
    if (resp.ok) {
      return body.data
    }
  }

  saveCenters = async (data: ICenters) => {
    let service = 'centers'
    let method = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `centers/${data.key}`
      method = 'PATCH'
    }
    const resp = await useFetch(service, { ...data }, method)
    await validateSession(resp)
    const body = (await resp.json()) as BodyCenters & IRespSuccess
    if (resp.ok) {
      return body
    }
  }

  saveUsers = async (data: IUsers) => {
    let service = 'usuarios'
    let method = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `usuarios/${data.key}`
      method = 'PATCH'
    }
    const resp = await useFetch(service, { ...data }, method)
    await validateSession(resp)
    const body = (await resp.json()) as BodyUsers & IRespSuccess
    if (resp.ok) {
      return body
    }
  }

  saveProfiles = async (data: IProfiles) => {
    let service = 'perfiles'
    let method = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `perfiles/${data.key}`
      method = 'PATCH'
    }
    const resp = await useFetch(service, { ...data }, method)
    await validateSession(resp)
    const body = (await resp.json()) as BodyProfiles & IRespSuccess
    if (resp.ok) {
      return body
    }
  }

  saveBanksAccount = async (data: IBanksAccount) => {
    let service = 'bankAccounts'
    let method = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `bankAccounts/${data.key}`
      method = 'PATCH'
    }
    const resp = await useFetch(service, { ...data }, method)
    await validateSession(resp)
    const body = (await resp.json()) as BodyProfiles & IRespSuccess
    if (resp.ok) {
      return body
    }
  }

  saveRoomsType = async (data: IRoomType) => {
    let service = 'tipohabitacion'
    let method = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `tipohabitacion/${data.key}`
      method = 'PATCH'
    }
    const resp = await useFetch(service, { ...data }, method)
    await validateSession(resp)
    const body = (await resp.json()) as BodyTypeRooms & IRespSuccess
    if (resp.ok) {
      return body
    }
  }

  deleteCenter = async (id: number) => {
    const resp = await useFetch(`centers/${id}`, {}, 'DELETE')
    await validateSession(resp)
    const body = (await resp.json()) as BodyCenters & IRespSuccess
    if (resp.ok) {
      return body
    }
  }

  deleteUser = async (id: number) => {
    const resp = await useFetch(`usuarios/${id}`, {}, 'DELETE')
    await validateSession(resp)
    const body = (await resp.json()) as BodyCenters & IRespSuccess
    if (resp.ok) {
      return body
    }
  }

  deleteProfiles = async (id: number) => {
    const resp = await useFetch(`perfiles/${id}`, {}, 'DELETE')
    await validateSession(resp)
    const body = (await resp.json()) as BodyProfiles & IRespSuccess
    if (resp.ok) {
      return body
    }
  }

  deleteTypeRoom = async (id: number) => {
    const resp = await useFetch(`tipohabitacion/${id}`, {}, 'DELETE')
    await validateSession(resp)
    const body = (await resp.json()) as BodyTypeRooms & IRespSuccess
    if (resp.ok) {
      return body
    }
  }

  deleteBanksAccounts = async (id: number) => {
    const resp = await useFetch(`bankAccounts/${id}`, {}, 'DELETE')
    await validateSession(resp)
    const body = (await resp.json()) as BodyBanksAccounts & IRespSuccess
    if (resp.ok) {
      return body
    }
  }
}

export const settings = new SettingsService()
export default settings
