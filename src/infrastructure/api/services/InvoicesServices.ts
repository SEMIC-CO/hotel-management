import type { IInvoiceRepository } from "../../../core/domain/repositories"
import type { IInvoices } from "../../../core/shared/types/data"
import type { IRespSuccess } from "../../../core/shared/types/forms"
import {useFetch} from "../client/httpClient"
import {validateSession} from "../../auth/sessionManager"

interface Body {
    data?: IInvoices[]
}

class InvoicesServices implements IInvoiceRepository {
    save = async (data: IInvoices) => {
        let service = 'invoice'
        let method = 'POST'
        if (typeof data.key !== 'undefined') {
            service = `invoice/${data.key}`
            method = 'PATCH'
        }
        const resp = await useFetch(service, { ...data }, method)
        await validateSession(resp)
        const body = (await resp.json()) as Body & IRespSuccess
        if (resp.ok) {
            return body
        }
    }

    get = async (params = '') => {
        const resp = await useFetch(`invoice${params}`, [], 'GET')
        await validateSession(resp)
        const body: Body = (await resp.json()) as Body
        if (resp.ok) {
            return body.data
        }
        return []
    }

}

const invoices = new InvoicesServices();
export default invoices;