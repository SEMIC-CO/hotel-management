import type { IBedroomRepository } from '../../../core/domain/repositories'
import type { IBedrooms } from '../../../core/shared/types/data'
import type { IOptionsSelect, IRespSuccess } from '../../../core/shared/types/forms'
import {useFetch} from '../client/httpClient'
import {validateSession} from '../../auth/sessionManager'

interface Body {
  data?: IBedrooms[]
}
interface Options {
  data?: IOptionsSelect[]
}

class BedroomsServices implements IBedroomRepository {
  get = async<T = IBedrooms[]>(params = ''): Promise<T> => {
    const resp = await useFetch(`habitaciones${params}`, [], 'GET')
    await validateSession(resp)
    const body = await resp.json()
    if (resp.ok) {
      return body.data as T
    }
    return [] as T
  }

  getRoomSelect = async (param: string) => {
    const resp = await useFetch(`habitaciones${param}`, [], 'GET')
    await validateSession(resp)
    const body: Options = (await resp.json()) as Options
    if (resp.ok) {
      return body.data
    }
    return []
  }

  save = async (data: IBedrooms) => {
    let service = 'habitaciones'
    let method = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `habitaciones/${data.key}`
      method = 'PATCH'
    }
    const resp = await useFetch(service, { ...data }, method)
    await validateSession(resp)
    const body = (await resp.json()) as Body & IRespSuccess
    if (resp.ok) {
      return body
    }
  }

  delete = async (id: number) => {
    const resp = await useFetch(`habitaciones/${id}`, {}, 'DELETE')
    await validateSession(resp)
    const body = (await resp.json()) as Body & IRespSuccess
    if (resp.ok) {
      return body
    }
  }
}

const bedrooms = new BedroomsServices()
export default bedrooms
