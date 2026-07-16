import { Card } from 'primereact/card'
// import { DataView } from 'primereact/dataview'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

export const InfoCenters = () => {
  const [centers] = useState<any[]>([
    {
      key: 1,
      center_name: 'Centro 1'
    },
    {
      key: 2,
      center_name: 'Centro 2'
    },
    {
      key: 3,
      center_name: 'Centro 3'
    }
  ])

  useEffect(() => {
    // ProductService.getProductsSmall().then((data) =>
    //   setProducts(data.slice(0, 5))
    // )
  }, [])

  const columns: any[] = [
    { field: 'center_name', header: 'Centro' },
    { field: 'bookings', header: 'Reservas' },
    { field: 'check-in', header: 'Entradas' },
    { field: 'check-out', header: 'Salidas' },
    { field: 'canceladas', header: 'canceladas' }
  ]
  return (
    <Card
      role='region'
      className='w-1/2 p-0'
    >
      <div className='flex justify-between pb-2'>
          <h2 className='font-bold text-md text-blue-600'>CENTROS</h2>
      </div>
      <div>
        <DataTable
          value={centers}
          size='normal'
          className='table-dashbohard'
          // stripedRows
          // tableStyle={{ minWidth: '50rem' }}
        >
          {columns.map((col) => (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              className='column-dashbohard'
            />
          ))}
        </DataTable>
      </div>
    </Card>
  )
}
