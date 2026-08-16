import type { IDashboard } from "../../../../core/shared/types/data"
import { useContainer } from "../../../hooks/useContainer"
import { useEffect, useState } from "react"
import { useUser } from "../../../hooks/useUser"
import { createParamsUrl } from "../../../../core/shared/utils/utils"

export const useMyHotel = (): { dashboard: IDashboard | null } => {
    const { myHotelRepository } = useContainer()
    const [dashboard, setDashboard] = useState<IDashboard | null>(null)
    
    const user = useUser()

    useEffect(() => {
       refreshDashboard()
    }, [myHotelRepository])

    const refreshDashboard = async () => {
        const params = createParamsUrl({
            company_id: user.company_id,
        })
        const data = await myHotelRepository.getInfoDashbohard(params)
        console.log('dashboard data', data)
        setDashboard(data)
    }


    return {
        dashboard,
    }
}