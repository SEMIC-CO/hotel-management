import type { IInvoiceRepository } from '../../../core/domain/repositories'
import type { IInvoices } from '../../../core/shared/types/data'
import type { IRespSuccess } from '../../../core/shared/types/forms'
import { requestApi } from '../client/apiRequest'
import type { HttpMethod } from '../client/httpClient'

interface Body {
    data?: IInvoices[]
}

class InvoicesServices implements IInvoiceRepository {
    save = async (data: IInvoices) => {
        let service = 'invoice'
        let method: HttpMethod = 'POST'
        if (typeof data.key !== 'undefined') {
            service = `invoice/${data.key}`
            method = 'PATCH'
    }
        return requestApi<Body & IRespSuccess>(service, { ...data }, method)
    }

    get = async (params = '') => {
        const body = await requestApi<Body>(`invoice${params}`, [], 'GET')
        return body.data ?? []
    }
}

const invoices = new InvoicesServices()
export default invoices