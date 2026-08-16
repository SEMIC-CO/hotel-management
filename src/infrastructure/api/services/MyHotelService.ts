import type { IMyHotelRepository } from '../../../core/domain/repositories/IMyHotelRepository'
import type { IDashboard } from '../../../core/shared/types/data'
import { requestApi } from '../client/apiRequest'

interface Body {
    data?: IDashboard
}

class MyHotelService implements IMyHotelRepository {
    async getInfoDashbohard(params?: string) {
        const body = await requestApi<Body>(`dashboard${params}`, [], 'GET')
        return body.data ?? null
    }
}

export const myHotel = new MyHotelService()
export default myHotel