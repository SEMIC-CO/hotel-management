import { DataTableFilterMeta } from 'primereact/datatable'
import { IField } from './forms'

export interface Representative {
  name: string
  image: string
}

export interface Country {
  name: string
  code: string
}

export interface IColumns {
  name: string
  label: string
  type?: string
  width?: string
  filter?: boolean | string
  sort?: boolean
  hidden?: boolean
  body?: (rowData: any) => JSX.Element
}

export interface IContextMenu {
  selectedRow: any[]
  setSelectedRow: Dispatch<SetStateAction<any[]>>
  menu: any[]
}

export interface actionsButtons {
  refresh: () => void
  showFilters?: () => void
  cleanFilters?: () => void
}

export interface IListEdit<T extends DataTableValue> {
  data: T[]
  setData: Dispatch<SetStateAction<T[]>>
  columns: IField[]
  onRegisterAddRow?: (addRow: (() => void) | null) => void
}

export interface IListProps {
  setShowForm: Dispatch<SetStateAction<boolean>>
  columns: IColumns[]
  data: any[]
  dataKey?: string
  loading?: boolean
  contextMenu: IContextMenu
  setInitialValues?: Dispatch<SetStateAction<any[]>>
  initialValues?: []
  actionsButtons: actionsButtons
  setAction?: Dispatch<SetStateAction<'add' | 'edit'>>
}

export interface IHeadListProps {
  setShowForm: Dispatch<SetStateAction<boolean>>
  defaultFilters: DataTableFilterMeta
  filters: DataTableFilterMeta
  setFilters: Dispatch<SetStateAction<DataTableFilterMeta>>
  data: any[]
  dataTableRef: MutableRefObject<any>
  actionsButtons: actionsButtons,
  setAction?: Dispatch<SetStateAction<'add' | 'edit'>>
}

export interface IColumnMeta {
  field: string
  header: string
}
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void
  }
}
