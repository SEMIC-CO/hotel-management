import type { IBedroomRepository } from '../../../core/domain/repositories'
import type { IBedrooms } from '../../../core/shared/types/data'
import type { IOptionsSelect, IRespSuccess } from '../../../core/shared/types/forms'
import { requestApi } from '../client/apiRequest'
import type { HttpMethod } from '../client/httpClient'

interface Body<T> {
  data?: T
}

class BedroomsServices implements IBedroomRepository {
  get = async<T = IBedrooms[]>(params = ''): Promise<T> => {
    const body = await requestApi<Body<T>>(`habitaciones${params}`, [], 'GET')
    return (body.data ?? []) as T
  }

  getRoomSelect = async (param: string) => {
    const body = await requestApi<Body<IOptionsSelect[]>>(
      `habitaciones${param}`,
      [],
      'GET'
    )
    return body.data ?? []
  }

  save = async (data: IBedrooms) => {
    let service = 'habitaciones'
    let method: HttpMethod = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `habitaciones/${data.key}`
      method = 'PATCH'
    }
    return requestApi<Body<IBedrooms[]> & IRespSuccess>(
      service,
      { ...data },
      method
    )
  }

  delete = async (id: number) => {
    return requestApi<Body<IBedrooms[]> & IRespSuccess>(
      `habitaciones/${id}`,
      {},
      'DELETE'
    )
  }
}

const bedrooms = new BedroomsServices()
export default bedrooms
