import type { IBanksAccount, ICenters, IProfiles, IRoomType, IUsers } from '../../shared/types/data'
import type { IOptionsSelect, IRespSuccess } from '../../shared/types/forms'

export interface ISettingsRepository {
  getRoomTypes: (params?: string) => Promise<IOptionsSelect[]>
  getCenters: (params?: string) => Promise<IOptionsSelect[] | ICenters[]>
  getUsers: (params?: string) => Promise<IOptionsSelect[] | IUsers[]>
  getProfiles: (params?: string) => Promise<IProfiles[] | IOptionsSelect[]>
  getCities: (params?: string) => Promise<IOptionsSelect[]>
  getBanks: (params?: string) => Promise<IOptionsSelect[] | IProfiles[]>
  getBanksAccounts: <T>(params?: string) => Promise<T>
  getRoomsType: (params?: string) => Promise<IOptionsSelect[] | IRoomType[]>
  getSequences: (params?: string) => Promise<IOptionsSelect[] | ICenters[]>
  saveCenters: (data: ICenters) => Promise<BodyCenters & IRespSuccess>
  saveUsers: (data: IUsers) => Promise<BodyUsers & IRespSuccess>
  saveProfiles: (data: IProfiles) => Promise<BodyProfiles & IRespSuccess>
  saveBanksAccount: (data: IBanksAccount) => Promise<BodyProfiles & IRespSuccess>
  saveRoomsType: (data: IRoomType) => Promise<BodyTypeRooms & IRespSuccess>
  verifyPassword: (data: { id: number; password: string }) => Promise<IRespSuccess>
  updatePassword: (id: number, data: {password: string}) => Promise<IRespSuccess>
  deleteCenter: (id: number) => Promise<BodyCenters & IRespSuccess>
  deleteUser: (id: number) => Promise<BodyCenters & IRespSuccess>
  deleteProfiles: (id: number) => Promise<BodyProfiles & IRespSuccess>
  deleteTypeRoom: (id: number) => Promise<BodyTypeRooms & IRespSuccess>
  deleteBanksAccounts: (id: number) => Promise<BodyBanksAccounts & IRespSuccess>
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
