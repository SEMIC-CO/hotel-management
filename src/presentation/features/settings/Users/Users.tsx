import { useEffect } from 'react'
import { Toast } from 'primereact/toast'
import { FormUsers } from './FormUsers'
import { DataList } from '../../../components/ui/DataTable/DataList'
import { useUsersStore } from '../../../../infrastructure/stores/user.store'
import { useContainer } from '../../../hooks/useContainer'
import { useSettingsList } from '../hooks/useSettingsList'

export const Users = () => {
  const { settingsRepository } = useContainer()
  const { updateState } = useUsersStore()
  const list = useSettingsList({
    getFn: settingsRepository.getUsers,
    deleteFn: settingsRepository.deleteUser
  })

  useEffect(() => {
    list.setColumns([
      { label: 'Id', name: 'user_id', filter: true, sort: true, width: '2rem' },
      { label: 'Nombres', name: 'names', filter: true, sort: true, width: '10rem' },
      { label: 'Apellidos', name: 'surnames', filter: true, sort: true, width: '10rem' },
      { label: 'Email / Usuario', name: 'email', filter: true, width: '10rem' },
      { label: 'No celular', name: 'cell_phone', filter: true, width: '10rem' },
      { label: 'Dirección', name: 'address', filter: true, width: '10rem' },
      { label: 'Estado', name: 'state', sort: true, width: '10rem' },
      { label: 'Profile Id', name: 'profile_id', width: '10rem', hidden: true },
      { label: 'Profile', name: 'profile', filter: true, width: '10rem' },
      { label: 'Centro', name: 'center_name', filter: true, width: '10rem' },
      { label: 'Tipo', name: 'type', width: '10rem' }
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
      <FormUsers
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
