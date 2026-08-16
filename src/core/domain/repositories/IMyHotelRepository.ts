import type { IDashboard } from '../../shared/types/data'
// import type { IRespSuccess } from '../../shared/types/forms'


export interface IMyHotelRepository {
//   getCentersDashbohard: (data: IInvoices) => Promise<Body & IRespSuccess>
  getInfoDashbohard: (params?: string) => Promise<IDashboard | null>
}

// interface Body {
//   data?: IDashboard[]
// }