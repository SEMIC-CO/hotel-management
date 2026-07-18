export interface IConstants {
  center_id?: number
  created_at?: string
  created_by?: string | number
  updated_at?: string
  updated_by?: string | number
}
export interface IBedrooms {
  description: string
  fecha: string
  no_room: string
  room_id: number
  state: string
  type: string
  key?: number | string
}
export interface IInvoices {
  key?: number | string
  entry_id: number
  room_id: number | string
  customer_id: number
  customer: string
  no_document: number
  names?: string
  entry_date: string
  exit_date: string
  val_day?: number
  val_room?: number
  total_days: number
  total_amount_pay: number
  status: string
}
export interface ICustomers {
  key?: number | string
  room_id?: number | string
  customer_id: number
  names: string
  surnames: string
  document_type: string
  no_document: string | number
  birthdate: string | Date
  email: string
  cell_phone: string | number
  cell_phone_emergency: string | number
}
export interface IBookings {
  key?: number | string
  booking_id: number
  entry_id: number
  room_id: number | string
  customer_id: number
  customer: string
  no_document: number
  names?: string
  entry_date: string
  exit_date: string
  val_day?: number
  val_room?: number
  total_days: number
  total_amount_pay: number
  status: string,
  total_reservation: number | string
}
export interface IEntries {
  key?: number | string
  entry_id: number
  room_id: number | string
  customer_id: number
  customer: string
  no_document: number
  names?: string
  entry_date: string
  exit_date: string
  val_day?: number
  val_room?: number
  total_days: number
  total_amount_pay: number
  status: string
}
export interface IUsers {
  key?: number
  names: string
  surnames: string
  email: string
  cell_phone: number
  address: string
  username: string
  center_id: number
  company_id: number
  profile_id: number
  password: string
  type: string
  user_id: number
}
export interface IAuth {
  username: string
  password: string
}
export interface ISession {
  isAuthenticated: boolean
  user?: IUsers | undefined
  message?: string
}
export interface IUserRegister {
  names: string
  surnames: string
  cell_phone: string
  email: string
  address: string
  password: string
}

export interface ICompanyRegister {
  company_name: string
  nit: string
  email: string
  phone: string
  city: string
  address: string
}
export interface ICenters {
  key?: number
  centers_id: number
  center_name: string
  address: string
  phone: string
  city: string
  company_id: number
}
export interface IProfiles {
  key?: number
  profile_id: number
  profile: string
  type: string
  company_id: number
}
export interface IRoomType {
  key?: number
  id_room_type: number
  name: string
  type: string
  company_id: number
  center_id: number
}
export interface IRoomsBookings {
  key?: number
  type_room: string
  room: string
  price: number
}

export interface IBanksAccount {
  key?: number
  bank_account_id: number
  number_accounts: string
  type: string
  bank_id: number
}
export interface IRegister {
  user: IUserRegister
  company: ICompanyRegister
}
export interface RoutesProps {
  children: JSX.Element // Define que los hijos deben ser un componente React válido
}
