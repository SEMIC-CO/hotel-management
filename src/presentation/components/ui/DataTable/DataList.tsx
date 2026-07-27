import {useState, useRef, useEffect} from 'react'
import {FilterMatchMode, FilterOperator} from 'primereact/api'
import {DataTable, type DataTableFilterMeta} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {HeaderList} from './HeaderList'
import {ContextMenu} from 'primereact/contextmenu'
import type { IListProps } from '../../../../core/shared/types/datalist'
import {Tag} from 'primereact/tag'
import {OverlayPanel} from 'primereact/overlaypanel'
import {List} from './List'
import {STATUS_COLORS} from '../../../../core/shared/utils/constants'
import {formatCurrency} from '../../../../core/shared/utils/utils'

export const DataList = ({
  setShowForm,
  columns,
  data,
  dataKey = 'key',
  loading,
  contextMenu,
  actionsButtons,
  setAction
}: IListProps) => {
  const { selectedRow, setSelectedRow, menu } = contextMenu
  const [filtersList, setFiltersList] = useState<any[]>([])
  const dataTableRef = useRef<any>(null)
  const overlayRef = useRef<any[]>([])

  const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  }

  useEffect(() => {
    if (data.length > 0) {
      const fields: any[] = []
      const filters: DataTableFilterMeta = { ...defaultFilters }
      for (const index in data[0]) {
        fields.push(index)
        filters[index] = {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        }
      }
      setFiltersList(fields)
      setFilters(filters)
    }
  }, [data])

  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters)
  const cm = useRef<ContextMenu>(null)

  const [overlayData, setOverlayData] = useState<any[]>([])
  const [overlayString, setOverlayString] = useState<string>('')
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null)

  const clickOverlay = (e: React.MouseEvent, data: any[], field: string) => {
    if (activeOverlay && activeOverlay !== field) {
      overlayRef.current[activeOverlay.length]?.hide()
    }
    
    if (Array.isArray(data) && data.length > 0) {
      setOverlayData(data)
      setOverlayString('')
    } else {
      setOverlayData([])
      setOverlayString('No data available')
    }
    setActiveOverlay(field)
    overlayRef.current[field.length]?.toggle(e)
  }

  const tagTemplate = (data: any[], field: string) => {
    return (
      <>
        {Array.isArray(data) &&
          data.length > 0 &&
          data.map((item: any, index: number) => (
            <Tag
              severity='info'
              key={index}
              className='mr-1 mb-1'
            >
              {item[field]}
            </Tag>
          ))}

        {typeof data === 'string' && (
          <Tag
            severity='info'
            className={`mr-1 mb-1 ${STATUS_COLORS[data]}`}
            // style={{
            //   background: STATUS_COLORS[data] || '#e03852'
            // }}
          >
            {data}
          </Tag>
        )}
      </>
    )
  }

  const tooltipTemplate = (data: any, field: any) => {
    let columns = []
    if (Array.isArray(data) && data.length > 0) {
      for (const row of data) {
        for (const key in row) {
          columns.push({
            name: key,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
          })
        }
      }
    }
    // setIdRefs((prev) => ({ ...prev, [field]:  }))
    return (
      <>
        <OverlayPanel ref={(el) => void (overlayRef.current[field.length] = el)}>
          {columns.length > 0 && (
            <List
              data={overlayData}
              columns={columns}
            />
          )}

          {typeof data === 'string' && (
            <div className='mb-1 text-xs'>{overlayString}</div>
          )}
        </OverlayPanel>
      </>
    )
    // return rowData[field] ? rowData[field].toString() : ''
  }

  const getTemplateToType = (types: string[], data: any, field: string) => {
    return (
      <>
        {types.includes('tooltip') ? (
          <div
            className='cursor-pointer'
            // onClick={(e) => clickOverlay(e, data, field)}
            onMouseEnter={(e) => clickOverlay(e, data, field)}
            // onMouseLeave={(e) => clickOverlayLeave(e, field)}
          >
            {types.includes('tag') && tagTemplate(data, field)}
            {types.includes('text') && data}
            {types.includes('numeric') && formatCurrency(data)}
            {tooltipTemplate(data, field)}
          </div>
        ) : (
          <>
            {types.includes('tag') && tagTemplate(data, field)}
            {types.includes('text') && data}
            {types.includes('numeric') && formatCurrency(data)}
          </>
        )}
      </>
    )
  }

  const columnBodyTemplate = (rowData: any, { column }: any) => {
    const dataType: string = column.props.dataType
    const field = column.props.field

    const types = dataType.split(',').map((type) => type.trim())
    if (types.length > 1) {
      return getTemplateToType(types, rowData[field], field)
    }

    if (typeof rowData[field] === 'undefined') return ''

    if (dataType === 'numeric') {
      return formatCurrency(rowData[field])
    } else if (dataType === 'tag') {
      return tagTemplate(rowData[field], field)
    }

    if (typeof rowData[field] === 'object' && rowData[field] !== null) {
      return JSON.stringify(rowData[field])
    }

    return rowData[field]
  }

  const header = (
    <HeaderList
      setShowForm={setShowForm}
      defaultFilters={defaultFilters}
      filters={filters}
      setFilters={setFilters}
      data={data}
      dataTableRef={dataTableRef}
      actionsButtons={actionsButtons}
      setAction={setAction}
    />
  )

  return (
    <div className='datalist'>
      <ContextMenu
        model={menu}
        ref={cm}
        onHide={() => setSelectedRow([])}
      />
      <DataTable
        ref={dataTableRef}
        tableStyle={{ fontSize: '14px' }}
        value={data}
        paginator
        resizableColumns
        showGridlines
        rows={20}
        loading={loading}
        dataKey={dataKey}
        filters={filters}
        globalFilterFields={filtersList}
        size='small'
        header={header}
        emptyMessage='No data found.'
        onContextMenu={(e) =>
          e.data.type !== 'SISTEMA' ? cm?.current?.show(e.originalEvent) : ''
        }
        contextMenuSelection={selectedRow}
        onContextMenuSelectionChange={(e) => setSelectedRow(e.value)}
      >
        {columns.map(({ name, label, type, filter, sort, width, hidden }) => {
          if (typeof type === 'undefined') {
            type = 'text'
          } else if (type === 'money') {
            type = 'numeric'
          } else if (type === 'date') {
            type = 'date'
          } else if (type === 'tooltip') {
            type = 'tooltip'
          } else if (type === 'tag') {
            type = 'tag'
          } else {
            type = type
          }

          typeof filter === 'undefined' ? (filter = false) : (filter = true)
          typeof sort === 'undefined' ? (sort = false) : (sort = true)
          typeof width === 'undefined' ? (width = '14rem') : (width = width)

          return (
            <Column
              key={name}
              field={name}
              header={label}
              filterField={name}
              dataType={type}
              showFilterMatchModes={false}
              showFilterMenuOptions={false}
              showFilterOperator={false}
              // filterMatchModeOptions={}
              filterType='text'
              // filterApply={}
              filterPlaceholder='Buscar'
              filterMenuStyle={{ width: '14rem' }}
              style={{ minWidth: `${width}` }}
              body={columnBodyTemplate}
              sortable={sort}
              filter={filter}
              hidden={hidden}
              // filterElement={representativeFilterTemplate}
            />
          )
        })}
      </DataTable>
    </div>
  )
}
