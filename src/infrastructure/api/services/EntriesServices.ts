import type { IEntryRepository } from '../../../core/domain/repositories'
import type { IEntries } from '../../../core/shared/types/data'
import {useFetch} from '../client/httpClient'
import {validateSession} from '../../auth/sessionManager'

interface Body {
  ok: boolean
  message?: string | undefined
  data?: IEntries[]
}

class EntriesServices implements IEntryRepository {
  get = async (params = '') => {
    const resp = await useFetch(`ingresos${params}`, [], 'GET')
    await validateSession(resp)
    const body = await resp.json() as Body
    if (resp.ok) {
      return body.data
    }
  }

  save = async (data: IEntries) => {
    let service = 'ingresos'
    let method = 'POST'
    if (typeof data.key !== 'undefined') {
      service = `ingresos/${data.key}`
      method = 'PATCH'
    }
    const resp = await useFetch(service, { ...data }, method)
    await validateSession(resp)
    const body = await resp.json() as Body
    console.log(body)
    if (resp.ok) {
      return body
    }
  }
}

export const entries = new EntriesServices()
export default entries
