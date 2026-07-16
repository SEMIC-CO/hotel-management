import type { IAuth, IRegister, ISession } from '../../shared/types/data'
import type { IOptionsSelect } from '../../shared/types/forms'

export interface IAuthRepository {
  authLogin: (data: IAuth) => Promise<ISession>
  authLogout: () => Promise<ISession>
  verifySession: () => Promise<ISession | false>
  refreshToken: () => Promise<ISession | false>
  registerCustomer: (data: IRegister) => Promise<Body | false>
  getCountries: () => Promise<Options>
  getCities: () => Promise<Options>
}

interface Options {
  data?: IOptionsSelect[]
}

interface Body {
  ok: boolean
  message: string
  data?: []
}
