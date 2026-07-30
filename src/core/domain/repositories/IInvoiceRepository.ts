import type { IInvoices } from '../../shared/types/data'
import type { IRespSuccess } from '../../shared/types/forms'

export interface IInvoiceRepository {
  save: (data: IInvoices) => Promise<Body & IRespSuccess>
  get: (params?: string) => Promise<IInvoices[]>
}

interface Body {
  data?: IInvoices[]
}
