import type { IBanksAccount, ICenters, IProfiles, IRoomType, IUsers } from '../../shared/types/data'
import type { IOptionsSelect, IRespSuccess } from '../../shared/types/forms'

export interface ISettingsRepository {
  getRoomTypes: (params?: string) => Promise<IOptionsSelect[] | undefined>
  getCenters: (params?: string) => Promise<IOptionsSelect[] | ICenters[] | undefined>
  getUsers: (params?: string) => Promise<IOptionsSelect[] | IUsers[] | undefined>
  getProfiles: (params?: string) => Promise<IProfiles[] | IOptionsSelect[] | undefined>
  getCities: (params?: string) => Promise<IOptionsSelect[] | undefined>
  getBanks: (params?: string) => Promise<IOptionsSelect[] | IProfiles[] | undefined>
  getBanksAccounts: <T>(params?: string) => Promise<T | undefined>
  getRoomsType: (params?: string) => Promise<IOptionsSelect[] | IRoomType[] | undefined>
  getSequences: (params?: string) => Promise<IOptionsSelect[] | ICenters[] | undefined>
  saveCenters: (data: ICenters) => Promise<(BodyCenters & IRespSuccess) | undefined>
  saveUsers: (data: IUsers) => Promise<(BodyUsers & IRespSuccess) | undefined>
  saveProfiles: (data: IProfiles) => Promise<(BodyProfiles & IRespSuccess) | undefined>
  saveBanksAccount: (data: IBanksAccount) => Promise<(BodyProfiles & IRespSuccess) | undefined>
  saveRoomsType: (data: IRoomType) => Promise<(BodyTypeRooms & IRespSuccess) | undefined>
  deleteCenter: (id: number) => Promise<(BodyCenters & IRespSuccess) | undefined>
  deleteUser: (id: number) => Promise<(BodyCenters & IRespSuccess) | undefined>
  deleteProfiles: (id: number) => Promise<(BodyProfiles & IRespSuccess) | undefined>
  deleteTypeRoom: (id: number) => Promise<(BodyTypeRooms & IRespSuccess) | undefined>
  deleteBanksAccounts: (id: number) => Promise<(BodyBanksAccounts & IRespSuccess) | undefined>
}

interface BodyCenters {
  data?: ICenters[]
}
interface BodyUsers {
  data?: IUsers[]
}
interface BodyProfiles {
  data?: IProfiles[]
}
interface BodyBanksAccounts {
  data?: IBanksAccount[]
}
interface BodyTypeRooms {
  data?: IRoomType[]
}
