import { useEffect } from 'react'
import { Toast } from 'primereact/toast'
import { DataList } from '../../../components/ui/DataTable/DataList'
import { FormCenters } from './FormCenters'
import { useCentersStore } from '../../../../infrastructure/stores/centers.store'
import { useContainer } from '../../../hooks/useContainer'
import { useSettingsList } from '../hooks/useSettingsList'

export const Centers = () => {
  const { settingsRepository } = useContainer()
  const { updateState } = useCentersStore()
  const list = useSettingsList({
    getFn: settingsRepository.getCenters,
    deleteFn: settingsRepository.deleteCenter
  })

  useEffect(() => {
    list.setColumns([
      { name: 'centers_id', label: 'id', filter: true, sort: true, width: '2rem' },
      { name: 'center_name', label: 'Nombre de centro', filter: true, sort: true, width: '10rem' },
      { name: 'address', label: 'Dirección', filter: true, width: '10rem' },
      { name: 'phone', label: 'Celular', filter: true, width: '10rem' },
      { name: 'city', label: 'Ciudad Id', visible: false, width: '10rem' },
      { name: 'city_name', label: 'Ciudad', filter: true, width: '10rem' }
    ])
  }, [])

  const update = (row: any) => {
    list.setShowForm(true)
    updateState(row)
  }

  const contextMenu = {
    selectedRow: list.selectedRow,
    setSelectedRow: list.setSelectedRow,
    menu: [
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-search',
        command: () => update(list.selectedRow)
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
      <FormCenters
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
