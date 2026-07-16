import type { ICustomers } from '../../shared/types/data'
import type { IRespSuccess, ISearch } from '../../shared/types/forms'

export interface ICustomerRepository {
  get: (params?: string) => Promise<ICustomers[] | undefined>
  getCustomerSearch: (param: string) => Promise<ISearch[] | undefined>
  save: (data: ICustomers) => Promise<(Body & IRespSuccess) | undefined>
  delete: (id: number | string) => Promise<(Body & IRespSuccess) | undefined>
}

interface Body {
  data?: ICustomers[]
}
