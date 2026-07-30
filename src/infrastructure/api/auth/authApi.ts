import type { IAuthRepository } from '../../../core/domain/repositories'
import type { IAuth, IRegister, ISession } from '../../../core/shared/types/data'
import type { IOptionsSelect } from '../../../core/shared/types/forms'
import { validateSession } from '../../auth/sessionManager'
import { requestApi } from '../client/apiRequest'
import { readApiResponse, requestHttp } from '../client/httpClient'

interface Options {
  data?: IOptionsSelect[]
}
interface Body {
  ok: boolean
  message: string
  data?: []
}
class LoginServer implements IAuthRepository {
  authLogin = async (data: IAuth) => {
    return requestApi<ISession>('auth/login/', { ...data }, 'POST')
  }

  authLogout = async () => {
    return requestApi<ISession>('auth/logout', {}, 'POST')
  }

  verifySession = async () => {
    const resp = await requestHttp('auth/verify-sesion', {}, 'POST')
    await validateSession(resp)

    if (resp.status === 401) {
      return false
    }
    return readApiResponse<ISession>(resp)
  }

  refreshToken = async () => {
    const resp = await requestHttp('auth/refresh-token', {}, 'POST')
    await validateSession(resp)

    if (resp.status === 401) {
      return false
    }
    return readApiResponse<ISession>(resp)
  }

  registerCustomer = async (data: IRegister) => {
    return requestApi<Body>('company', { ...data }, 'POST')
  }

  getCountries = async () => {
    return requestApi<Options>('location/paises/?select=true', {}, 'GET')
  }

  getCities = async () => {
    return requestApi<Options>('location/cities/?select=true', {}, 'GET')
  }
}

const auth = new LoginServer()
export default auth
