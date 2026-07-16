import type { IEntries, IInvoices } from '../../shared/types/data'
import type { IRespSuccess } from '../../shared/types/forms'

export interface IInvoiceRepository {
  save: (data: IEntries) => Promise<(Body & IRespSuccess) | undefined>
  get: (params?: string) => Promise<IInvoices[] | undefined>
}

interface Body {
  data?: IInvoices[]
}
