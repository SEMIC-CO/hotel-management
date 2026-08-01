import type { ISettingsRepository } from '../../../core/domain/repositories'
import type { IBanksAccount, ICenters, IProfiles, IRoomType, IUsers } from '../../../core/shared/types/data'
import type { IOptionsSelect, IRespSuccess } from '../../../core/shared/types/forms'
import { requestApi } from '../client/apiRequest'
import type { HttpMethod } from '../client/httpClient'

interface IBody<T> {
  data?: T
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
    const body = await requestApi<IBody<IOptionsSelect[]>>(
      `tipohabitacion${params}`,
      [],
      'GET'
    )
    return body.data ?? []
  }

  getCenters = async (params = '') => {
    const body = await requestApi<IBody<IOptionsSelect[] | ICenters[]>>(
      `centers${params}`,
      [],
      'GET'
    )
    return body.data ?? []
  }

  getUsers = async (params = '') => {
    const body = await requestApi<IBody<IOptionsSelect[] | IUsers[]>>(
      `usuarios${params}`,
      [],
      'GET'
    )
    return body.data ?? []
  }

  getProfiles = async (params = '') => {
    const body = await requestApi<IBody<IProfiles[] | IOptionsSelect[]>>(
      `perfiles${params}`,
      [],
      'GET'
    )
    return body.data ?? []
  }

  getCities = async (params = '') => {
    const body = await requestApi<IBody<IOptionsSelect[]>>(
      `location/cities${params}`,
      [],
      'GET'
    )
    return body.data ?? []
  }

  getBanks = async (params = '') => {
    const body = await requestApi<IBody<IOptionsSelect[] | IProfiles[]>>(
      `banks/${params}`,
      [],
      'GET'
    )
    return body.data ?? []
  }

  getBanksAccounts = async<T>(params = '') => {
    const body = await requestApi<IBody<T>>(
      `bankAccounts/${params}`,
      [],
      'GET'
    )
    return (body.data ?? []) as T
  }

  getRoomsType = async (params = '') => {
    const body = await requestApi<IBody<IOptionsSelect[] | IRoomType[]>>(
      `tipohabitacion/${params}`,
      [],
      'GET'
    )
    return body.data ?? []
  }

  getSequences = async (params = '') => {
    const body = await requestApi<IBody<IOptionsSelect[] | ICenters[]>>(
      `invoiceSequences${params}`,
      [],
      'GET'
    )
    return body.data ?? []
  }

  saveCenters = async (data: ICenters) => {
    let service = 'centers'
    let method: HttpMethod = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `centers/${data.key}`
      method = 'PATCH'
    }
    return requestApi<BodyCenters & IRespSuccess>(
      service,
      { ...data },
      method
    )
  }

  saveUsers = async (data: IUsers) => {
    let service = 'usuarios'
    let method: HttpMethod = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `usuarios/${data.key}`
      method = 'PATCH'
    }
    return requestApi<BodyUsers & IRespSuccess>(service, { ...data }, method)
  }

  saveProfiles = async (data: IProfiles) => {
    let service = 'perfiles'
    let method: HttpMethod = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `perfiles/${data.key}`
      method = 'PATCH'
    }
    return requestApi<BodyProfiles & IRespSuccess>(
      service,
      { ...data },
      method
    )
  }

  saveBanksAccount = async (data: IBanksAccount) => {
    let service = 'bankAccounts'
    let method: HttpMethod = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `bankAccounts/${data.key}`
      method = 'PATCH'
    }
    return requestApi<BodyProfiles & IRespSuccess>(
      service,
      { ...data },
      method
    )
  }

  saveRoomsType = async (data: IRoomType) => {
    let service = 'tipohabitacion'
    let method: HttpMethod = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `tipohabitacion/${data.key}`
      method = 'PATCH'
    }
    return requestApi<BodyTypeRooms & IRespSuccess>(
      service,
      { ...data },
      method
    )
  }

  updatePassword = async (id: number, data: {password: string}) => {
    const service = `usuarios/change-password/${id}`
    const method: HttpMethod = 'PATCH'
    return requestApi<IRespSuccess>(
      service,
      { ...data },
      method
    )
  }

  verifyPassword = async (data: { id: number; password: string }) => {
    const service = 'usuarios/verify-password'
    const method: HttpMethod = 'POST'
    return requestApi<IRespSuccess>(
      service,
      { ...data },
      method
    )
  }

  deleteCenter = async (id: number) => {
    return requestApi<BodyCenters & IRespSuccess>(
      `centers/${id}`,
      {},
      'DELETE'
    )
  }

  deleteUser = async (id: number) => {
    return requestApi<BodyCenters & IRespSuccess>(
      `usuarios/${id}`,
      {},
      'DELETE'
    )
  }

  deleteProfiles = async (id: number) => {
    return requestApi<BodyProfiles & IRespSuccess>(
      `perfiles/${id}`,
      {},
      'DELETE'
    )
  }

  deleteTypeRoom = async (id: number) => {
    return requestApi<BodyTypeRooms & IRespSuccess>(
      `tipohabitacion/${id}`,
      {},
      'DELETE'
    )
  }

  deleteBanksAccounts = async (id: number) => {
    return requestApi<BodyBanksAccounts & IRespSuccess>(
      `bankAccounts/${id}`,
      {},
      'DELETE'
    )
  }
}

export const settings = new SettingsService()
export default settings
