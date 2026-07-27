import type { ICustomerRepository } from '../../../core/domain/repositories'
import type { ICustomers } from '../../../core/shared/types/data'
import type { IRespSuccess, ISearch } from '../../../core/shared/types/forms'
import {useFetch} from '../client/httpClient'
import {validateSession} from '../../auth/sessionManager'

interface Body {
  data?: ICustomers[]
}
interface Search {
  data?: ISearch[]
}
class CustomersServices implements ICustomerRepository {
  get = async (params = '') => {
    const resp = await useFetch(`clientes${params}`, [], 'GET')
    await validateSession(resp)
    const body = await resp.json() as Body
    if (resp.ok) {
      return body.data
    }
  }

  getCustomerSearch = async (param: string) => {
    const resp = await useFetch(`clientes${param}`, [], 'GET')
    await validateSession(resp)
    const body = await resp.json() as Search
    if (resp.ok) {
      return body.data
    }
  }

  save = async (data: ICustomers) => {
    let service = 'clientes'
    let method = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `clientes/${data.key}`
      method = 'PATCH'
    }
    const resp = await useFetch(service, { ...data }, method)
    await validateSession(resp)
    const body = await resp.json() as Body & IRespSuccess
    if (resp.ok) {
      return body
    }
  }

  delete = async (id: number | string) => {
    const resp = await useFetch(`clientes/${id}`, {}, 'DELETE')
    await validateSession(resp)
    const body = await resp.json() as Body & IRespSuccess
    if (resp.ok) {
      return body
    }
  }
}

const customers = new CustomersServices()
export default customers
