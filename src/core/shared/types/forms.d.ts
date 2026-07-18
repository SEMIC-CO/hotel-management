import * as yup from 'yup'
import { IBedrooms, IBookings, ICustomers, IEntries, ISession, IUsers } from './data'
import { StepperRefAttributes } from 'primereact/stepper'

export type ValueField = string | number | undefined

export interface IShow {
  onActionForm?: (val: any) => void
  showForm: boolean
  setShowForm: Dispatch<SetStateAction<boolean>>
  action?: 'add' | 'edit'
}
export interface IOptionsSelect {
  name: string
  code: number | string
  [x: string]: any
}
interface ISearch {
  name: string
  code: number | string
  [x: string]: any
}
interface IOptionsRadio {
  label: string
  value: number | string
  [x: string]: any
}
export interface IField {
  type:
  | 'text'
  | 'email'
  | 'password'
  | 'hidden'
  | 'number'
  | 'date'
  | 'select'
  | 'textArea'
  | 'search'
  | 'radio'
  | 'group'
  | 'button'
  | 'section'
  label: string
  header?: string
  name: string
  placeholder?: string
  options?: IOptionsSelect[] | IOptionsRadio[] | undefined
  items?: ISearch[]
  fields?: IField[]
  filter?: string
  hidden?: boolean
  keyfilter?:
  | 'int'
  | 'pint'
  | 'num'
  | 'pnum'
  | 'money'
  | 'hex'
  | 'alpha'
  | 'alphanum'
  | 'email'
  | undefined
  required?: boolean | undefined
  disabled?: boolean | undefined
  value?: ValueField
  date?: Date
  showTime?: boolean
  onSelect?: (e: any) => void
  onChange?: (e: any, rowData?: any) => void
  onBlur?: (e: any) => void
  onChangeFunc?: (e: any, form?: any) => void
  onSetValue?: (e: any) => void
  style?: CSSProperties | undefined
  severity?: 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger',
  component?: ReactElement | ReactElement[] | undefined,
  addButtons?: JSX.Element | (() => JSX.Element),
  width?: string
}
// [x: string]: any

export interface FormProps {
  children?: ReactElement | ReactElement[] | undefined
  showForm?: boolean
  setShowForm?: Dispatch<SetStateAction<boolean>>
  nameForm?: string
  title?: string
  width?: string
  fields: IField[]
  handleSave: (dataForm: any, form?: FormikHelpers<any>) => void
  validationSchema: yup.ObjectSchema<any>
  useStoreForm: UseBoundStore<StoreApi<IStore>>
  classForm?: string
  type?: 'dialog' | 'normal'
  labelButtonSubmit?: string
  footer?: ReactElement | ReactElement[] | undefined
}

export interface IRespSuccess {
  ok: boolean
  message?: string
}

export interface IStore {
  values: IEntries | ICustomers | IBedrooms | ISession | Register | IBookings | IBanksAccount | IProfiles | ICenters | IRoomType | IUsers
  updateState: (
    values: IEntries | ICustomers | IBedrooms | ISession | Register | IBookings | IBanksAccount | IProfiles | ICenters | IRoomType | IUsers
  ) => void
  resetState: (values?: IEntries | ICustomers | IBedrooms | ISession | Register | IBookings | IBanksAccount | IProfiles | ICenters | IRoomType | IUsers) => void
}

interface IPropsSave {
  values: (IEntries | ICustomers | IBedrooms | IBookings | IBanksAccount | IProfiles | ICenters | IRoomType | IUsers) & IConstants
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export interface AuthProps {
  view: string
}

// export interface FormRef {
//   submitForm: () => void
// }

export type FormRef = FormikProps<{
  company_name: string
  nit: string
  email: string
  phone: string
  city: string
  address: string
  password: string
  repeat_password: string
}>
export interface ISteeperRef {
  prevCallback: () => void
  nextCallback: () => void
}
export interface IFormDataBusinessProps {
  stepperRef: RefObject<StepperRefAttributes>
}
