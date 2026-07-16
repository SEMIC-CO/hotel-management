import {Column} from 'primereact/column'
import {DataTable, type DataTableValue} from 'primereact/datatable'
import type { IColumns } from '../../../../core/shared/types/datalist'

export interface Ilist{
  data: DataTableValue[]
  columns: IColumns[]
  size?: 'small' | 'normal' | 'large'
  style?: React.CSSProperties
}

export const List = ({ data, columns, size = 'small', style = { fontSize: '14px' } }: Ilist) => {
  return (
    <div className='card'>
      <div className='flex justify-content-center mb-4'>
        {/* <SelectButton
          value={size}
          onChange={(e) => setSize(e.value)}
          options={sizeOptions}
        /> */}
      </div>
      <DataTable
        value={data}
        size={size}
        tableStyle={style}
      >
        {columns.map((col: IColumns) => (
          <Column
            key={col.name}
            field={col.name}
            header={col.label}
            body={col.body}
          />
        ))}
      </DataTable>
    </div>
  )
}
