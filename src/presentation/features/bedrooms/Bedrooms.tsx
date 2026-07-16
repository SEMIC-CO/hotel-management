import { Toast } from 'primereact/toast'
import { FormBedrooms } from './FormBedrooms'
import { DataList } from '../../components/ui/DataTable/DataList'
import { useBedroomsList } from './hooks/useBedroomsList'

export const Bedrooms = () => {
  const list = useBedroomsList()

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
      <FormBedrooms
        showForm={list.showForm}
        setShowForm={list.setShowForm}
        onActionForm={list.onActionForm}
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
