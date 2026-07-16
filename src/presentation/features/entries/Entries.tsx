import { Toast } from 'primereact/toast'
import { DataList } from '../../components/ui/DataTable/DataList'
import { FormEntries } from './FormEntries'
import { useEntriesList } from './hooks/useEntriesList'

export const Entries = () => {
  const list = useEntriesList()

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
        label: 'Cancelar ingreso',
        icon: 'pi pi-fw pi-times',
        command: () => list.cancelEntry(list.selectedRow)
      }
    ]
  }

  return (
    <div className='card flex justify-content-center w-full'>
      <Toast ref={list.toast} />
      <FormEntries
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
