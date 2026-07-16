import type { IAuthRepository } from '../../../core/domain/repositories'
import type { IAuth, IRegister, ISession } from '../../../core/shared/types/data'
import type { IOptionsSelect } from '../../../core/shared/types/forms'
import {useFetch} from '../client/httpClient'

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
    const resp = await useFetch('auth/login/', { ...data }, 'POST')
    const body = await resp.json() as ISession
    return body
  }

  authLogout = async () => {
    const resp = await useFetch('auth/logout', {}, 'POST')
    const body = await resp.json() as ISession
    return body
  }

  verifySession = async () => {
    const resp = await useFetch('auth/verify-sesion', {}, 'POST')
    console.log("verify-session", resp);
    
    if (resp.status === 401) {
      return false
    }
    const body = await resp.json() as ISession
    return body
  }

  refreshToken = async () => {
    const resp = await useFetch('auth/refresh-token', {}, 'POST')
    console.log(resp)

    if (resp.status === 401) {
      return false
    }
    const body = await resp.json() as ISession
    return body
  }

  registerCustomer = async (data: IRegister) => {
    const resp = await useFetch('company', { ...data }, 'POST')
    if (resp.status === 401) {
      return false
    }
    const body = await resp.json() as Body
    return body
  }

  getCountries = async () => {
    const resp = await useFetch('location/paises/?select=true', {}, 'GET')
    const body = await resp.json() as Options
    return body
  }

  getCities = async () => {
    const resp = await useFetch('location/cities/?select=true', {}, 'GET')
    const body = await resp.json() as Options
    return body
  }
}

const auth = new LoginServer()
export default auth
