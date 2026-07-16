import {Button} from 'primereact/button'
import {IconField} from 'primereact/iconfield'
import {InputIcon} from 'primereact/inputicon'
import {InputText} from 'primereact/inputtext'
import {useState} from 'react'
import type { IColumnMeta, IHeadListProps } from '../../../../core/shared/types/datalist'

export const HeaderList = ({
  setShowForm,
  defaultFilters,
  filters,
  setFilters,
  data,
  dataTableRef,
  actionsButtons,
  setAction
}: IHeadListProps) => {
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('')
  const { refresh, showFilters, cleanFilters } = actionsButtons

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const _filters = { ...filters }
    // @ts-ignore
    _filters['global'].value = value

    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const initFilters = () => {
    setFilters(defaultFilters)
    setGlobalFilterValue('')
  }

  const clearFilter = () => {
    initFilters()
  }

  const cols: IColumnMeta[] = [
    { field: 'no_romm', header: 'Code' },
    { field: 'name', header: 'Name' },
    { field: 'category', header: 'Category' },
    { field: 'quantity', header: 'Quantity' }
  ]

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field
  }))

  const exportCSV = (selectionOnly: any) => {
    dataTableRef.current.exportCSV({ selectionOnly })
  }

  const exportPdf = () => {
    import('jspdf').then(({ jsPDF }) => {
      import('jspdf-autotable').then(() => {
        // const doc = new jsPDF.default(0, 0)
        const doc = new jsPDF({
          orientation: 'p', // o 'landscape' si lo necesitas
          unit: 'mm',
          format: 'a4'
        })

        // doc.autoTable(exportColumns, data)
        doc.autoTable({
          head: exportColumns,
          body: data
        })
        doc.save('products.pdf')
      })
    })
  }

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data)
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      })

      saveAsExcelFile(excelBuffer, 'products')
    })
  }

  const saveAsExcelFile = (buffer: any, fileName: string) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        let EXCEL_EXTENSION = '.xlsx'
        const data = new Blob([buffer], {
          type: EXCEL_TYPE
        })

        module.default.saveAs(
          data,
          fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
        )
      }
    })
  }
  const handleShowForm = () => {
    setShowForm(true)
    typeof setAction !== 'undefined' && setAction('add')  
  }

  return (
    <div className='flex justify-between items-center gap-3'>
      <section className='flex gap-1'>
        <Button
          // label='Nuevo'
          // icon='pi pi-external-link'
          icon='pi pi-plus'
          onClick={() => handleShowForm()}
          rounded
          tooltip='Nuevo registro'
        />
        <Button
          type='button'
          icon='pi pi-refresh'
          rounded
          tooltip='Actualizar'
          onClick={() => refresh()}
        />
        {typeof showFilters !== 'undefined' && (
          <Button
            type='button'
            icon='pi pi-filter'
            rounded
            tooltip='Filtros'
            onClick={() => console.log('prueba')}
          />
        )}
      </section>
      <IconField>
        <InputIcon className='pi pi-search'> </InputIcon>
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          v-model='value1'
          placeholder='Search'
        />
      </IconField>
      <section className='flex gap-1'>
        {typeof cleanFilters !== 'undefined' && (
          <Button
            icon='pi pi-filter-slash'
            rounded
            raised
            tooltip='Limpiar filtros'
            aria-label='Filter'
            onClick={clearFilter}
          />
        )}
        <Button
          type='button'
          icon='pi pi-file'
          rounded
          tooltip='Exportar CSV'
          onClick={() => exportCSV(false)}
          data-pr-tooltip='CSV'
        />
        <Button
          type='button'
          icon='pi pi-file-excel'
          severity='success'
          rounded
          tooltip='Exportar XLS'
          onClick={exportExcel}
          data-pr-tooltip='XLS'
        />
        <Button
          type='button'
          icon='pi pi-file-pdf'
          severity='warning'
          rounded
          tooltip='Exportar PDF'
          onClick={exportPdf}
          data-pr-tooltip='PDF'
        />
      </section>
    </div>
  )
}
