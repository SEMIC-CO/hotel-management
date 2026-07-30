import type { ICustomers } from '../../shared/types/data'
import type { IRespSuccess, ISearch } from '../../shared/types/forms'

export interface ICustomerRepository {
  get: (params?: string) => Promise<ICustomers[]>
  getCustomerSearch: (param: string) => Promise<ISearch[]>
  save: (data: ICustomers) => Promise<Body & IRespSuccess>
  delete: (id: number | string) => Promise<Body & IRespSuccess>
}

interface Body {
  data?: ICustomers[]
}
