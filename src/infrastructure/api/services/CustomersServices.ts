import type { ICustomerRepository } from '../../../core/domain/repositories'
import type { ICustomers } from '../../../core/shared/types/data'
import type { IRespSuccess, ISearch } from '../../../core/shared/types/forms'
import { requestApi } from '../client/apiRequest'
import type { HttpMethod } from '../client/httpClient'

interface Body<T> {
  data?: T
}

class CustomersServices implements ICustomerRepository {
  get = async (params = '') => {
    const body = await requestApi<Body<ICustomers[]>>(
      `clientes${params}`,
      [],
      'GET'
    )
    return body.data ?? []
  }

  getCustomerSearch = async (param: string) => {
    const body = await requestApi<Body<ISearch[]>>(
      `clientes${param}`,
      [],
      'GET'
    )
    return body.data ?? []
  }

  save = async (data: ICustomers) => {
    let service = 'clientes'
    let method: HttpMethod = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `clientes/${data.key}`
      method = 'PATCH'
    }
    return requestApi<Body<ICustomers[]> & IRespSuccess>(
      service,
      { ...data },
      method
    )
  }

  delete = async (id: number | string) => {
    return requestApi<Body<ICustomers[]> & IRespSuccess>(
      `clientes/${id}`,
      {},
      'DELETE'
    )
  }
}

const customers = new CustomersServices()
export default customers
