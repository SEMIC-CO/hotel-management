import { Toast } from 'primereact/toast'
import { DataList } from '../../components/ui/DataTable/DataList'
import { useInvoicesList } from './hooks/useInvoicesList'

export const Invoices = () => {
  const list = useInvoicesList()

  return (
    <div className='card flex justify-content-center w-full'>
      <Toast ref={list.toast} />
      <DataList
        setShowForm={list.setShowForm}
        columns={list.columns}
        data={list.data}
        loading={list.loading}
        contextMenu={list.contextMenu}
        actionsButtons={{ refresh: list.refreshList }}
        setAction={list.setAction}
      />
    </div>
  )
}
