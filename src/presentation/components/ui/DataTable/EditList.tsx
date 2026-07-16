import {Button} from 'primereact/button'
import {Column, type ColumnEditorOptions, type ColumnEvent} from 'primereact/column'
import {DataTable, type DataTableValue} from 'primereact/datatable'
import {Dropdown, type DropdownChangeEvent} from 'primereact/dropdown'
import {InputNumber, type InputNumberValueChangeEvent} from 'primereact/inputnumber'
import {InputText} from 'primereact/inputtext'
import {useCallback, useEffect, useMemo} from 'react'
import type { IListEdit } from '../../../../core/shared/types/datalist'
import type { IField } from '../../../../core/shared/types/forms'

export const EditList = <T extends DataTableValue>({
  data,
  setData,
  columns,
  onRegisterAddRow
}: IListEdit<T>) => {
  const dataRowEmpty = useMemo(
    () =>
      columns.reduce(
    (acc: Record<string, any>, { name, type }) => {
      acc[name] = ''
      if (type === 'select') {
        acc[`${name}_text`] = 'Seleccione aquí..'
      }
      if (type === 'button') {
        acc[`${name}`] = name
        acc[`disabled_${name}`] = true
      }
      return acc
    },
    {}
  ),
    [columns]
  )

  const getNextKey = useCallback((rows: any[]) => {
    return rows.reduce((nextKey, row) => {
      return typeof row.key === 'number' && row.key >= nextKey
        ? row.key + 1
        : nextKey
    }, 1)
  }, [])

  const createEmptyRow = useCallback(
    (rows: any[]) => ({ ...dataRowEmpty, key: getNextKey(rows) }),
    [dataRowEmpty, getNextKey]
  )

  const addEmptyRow = useCallback(() => {
    setData((prev: any[]) => [...prev, createEmptyRow(prev)])
  }, [createEmptyRow, setData])

  useEffect(() => {
    setData((prev: any[]) => {
      if (prev.length === 0) {
        return [createEmptyRow(prev)]
      }
      return prev
    })
  }, [createEmptyRow, setData])

  useEffect(() => {
    onRegisterAddRow?.(addEmptyRow)

    return () => {
      onRegisterAddRow?.(null)
    }
  }, [addEmptyRow, onRegisterAddRow])

  const onCellEditComplete = (e: ColumnEvent) => {
    // let { rowData, newValue, field, originalEvent: event } = e
    let { rowData, newValue, field } = e
    rowData[field] =
      newValue && typeof newValue === 'object' && 'name' in newValue
        ? newValue.name
        : newValue
  }

  const cellEditor = (options: ColumnEditorOptions, field: any) => {
    const { type } = field

    if (type === 'number') return priceEditor(options)
    if (type === 'select') return selectEditor(options, field)
    else return textEditor(options)
  }

  const textEditor = (options: ColumnEditorOptions) => {
    return (
      <InputText
        type='text'
        value={options.value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          options.editorCallback?.(e.target.value)
        }
        onKeyDown={(e) => e.stopPropagation()}
      />
    )
  }

  const onChangeDropdown = (
    e: DropdownChangeEvent,
    options: ColumnEditorOptions,
    field: IField
  ) => {
    options.editorCallback!(e.value)
    const { rowData } = options

    setData((prev: any[]) => {
      return prev.map((dt) => {
        if (dt.key === rowData.key) {
          return {
            ...dt,
            [field.name]: rowData[field.name + '_text'].code,
            [`${field.name}_text`]: rowData[field.name + '_text'].name
          }
        }
        return dt
      })
    })

    if (typeof field.onChange === 'function') {
      field?.onChange(e.value, rowData)
    }
  }

  const selectEditor = (options: ColumnEditorOptions, field: IField) => {
    field.options = options.rowData[field.name + '_options'] || field.options
    field.label = ''
    return (
      <Dropdown
        value={options.value}
        onChange={(e: DropdownChangeEvent) =>
          onChangeDropdown(e, options, field)
        }
        options={field.options}
        optionLabel='name'
        placeholder='Seleccione'
      />
    )
  }

  const priceEditor = (options: ColumnEditorOptions) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e: InputNumberValueChangeEvent) =>
          options.editorCallback?.(e.value)
        }
        mode='currency'
        currency='USD'
        locale='en-US'
        onKeyDown={(e) => e.stopPropagation()}
      />
    )
  }

  const buttonEditor = (rowData: any, column: any) => {
    const disabled = rowData['disabled_' + column.name] || false
    return (
      <Button
        type={column.type}
        label={column.label}
        icon='pi pi-plus'
        rounded
        disabled={disabled}
        severity='warning'
        aria-label='Notification'
        className='w-[8rem] h-[2rem]'
        onClick={() => column.click(rowData)}
        // onClick={() => console.log(options, rowData, column)}
      />
    )
  }

  // const priceBodyTemplate = (rowData: any) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD'
  //   }).format(rowData.price)
  // }

  const buttonsRowTemplate = (rowData: any) => {
    return (
      <div className='flex gap-1'>
        {/* <Button
          type='button'
          icon='pi pi-plus'
          rounded
          severity='warning'
          aria-label='Add'
          className='w-[2rem] h-[2rem]'
          onClick={addEmptyRow}
        /> */}
        <Button
          type='button'
          className='w-[2rem] h-[2rem] bg-[#e03852]'
          icon='pi pi-times'
          rounded
          severity='danger'
          aria-label='Cancel'
          onClick={() => {
            setData((prev: any[]) =>
              prev.length > 1
                ? prev.filter((data) => data.key !== rowData.key)
                : prev
            )
          }}
        />
      </div>
    )
  }

  return (
    <div className='card p-fluid'>
      <DataTable
        value={data}
        editMode='cell'
        tableStyle={{ minWidth: '100%'}}
        size='small'
      >
        {columns.map((column) => {
          if (column.type === 'select') {
            return (
              <Column
                key={column.name + '_text'}
                field={column.name + '_text'}
                header={column.label}
                style={{ width: '25%' }}
                // body={}
                editor={(options) => cellEditor(options, column)}
                onCellEditComplete={onCellEditComplete}
              />
            )
          } else if (column.type === 'button') {
            return (
              <Column
                key={column.name}
                field={column.name}
                header={column.header || column.label}
                style={{ width: '25%' }}
                body={(rowData) => buttonEditor(rowData, column)}
                // editor={(options) => cellEditor(options, column)}
                // onCellEditComplete={cellEditor(options, column)}
              />
            )
          } else {
            return (
              <Column
                key={column.name}
                field={column.name}
                header={column.label}
                style={{ width: '25%' }}
                // body={column.type === 'number' && priceBodyTemplate}
                editor={(options) => cellEditor(options, column)}
                onCellEditComplete={onCellEditComplete}
              />
            )
          }
        })}
        <Column
          key='action_row'
          field='actions_row'
          header=''
          style={{ width: '15%' }}
          body={buttonsRowTemplate}
        />
      </DataTable>
    </div>
  )
}
