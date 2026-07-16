import type { IEntries } from '../../shared/types/data'

export interface IEntryRepository {
  get: (params?: string) => Promise<IEntries[] | undefined>
  save: (data: IEntries) => Promise<Body | undefined>
}

interface Body {
  ok: boolean
  message?: string | undefined
  data?: IEntries[]
}
