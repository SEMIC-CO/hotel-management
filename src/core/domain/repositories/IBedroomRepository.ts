import type { IBedrooms } from '../../shared/types/data'
import type { IOptionsSelect, IRespSuccess } from '../../shared/types/forms'

export interface IBedroomRepository {
  get: <T = IBedrooms[]>(params?: string) => Promise<T>
  getRoomSelect: (param: string) => Promise<IOptionsSelect[]>
  save: (data: IBedrooms) => Promise<Body & IRespSuccess>
  delete: (id: number) => Promise<Body & IRespSuccess>
}

interface Body {
  data?: IBedrooms[]
}
