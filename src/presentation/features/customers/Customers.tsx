import { Toast } from 'primereact/toast'
import { DataList } from '../../components/ui/DataTable/DataList'
import { FormCustomers } from './FormCustomers'
import { useCustomersList } from './hooks/useCustomersList'

export const Customers = () => {
  const list = useCustomersList()

  const contextMenu = {
    selectedRow: list.selectedRow,
    setSelectedRow: list.setSelectedRow,
    menu: [
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-search',
        command: () => list.update(list.selectedRow)
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-times',
        command: () => list.deleteItem(list.selectedRow)
      }
    ]
  }

  return (
    <div className='card flex justify-content-center w-full'>
      <Toast ref={list.toast} />
      <FormCustomers
        onActionForm={list.onActionForm}
        showForm={list.showForm}
        setShowForm={list.setShowForm}
      />
      <DataList
        setShowForm={list.setShowForm}
        columns={list.columns}
        data={list.data}
        loading={list.loading}
        contextMenu={contextMenu}
        actionsButtons={{ refresh: list.refreshList }}
      />
    </div>
  )
}
