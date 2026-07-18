import { useEffect } from 'react'
import { Toast } from 'primereact/toast'
import { DataList } from '../../../components/ui/DataTable/DataList'
import { FormBanksAccount } from './FormBanksAccount'
import { useBanksAccountsStore } from '../../../../infrastructure/stores/settings.store'
import { useContainer } from '../../../hooks/useContainer'
import { useSettingsList } from '../hooks/useSettingsList'

export const BanksAccount = () => {
  const { settingsRepository } = useContainer()
  const { updateState } = useBanksAccountsStore()
  const list = useSettingsList({
    getFn: settingsRepository.getBanksAccounts,
    deleteFn: settingsRepository.deleteBanksAccounts
  })

  useEffect(() => {
    list.setColumns([
      { label: 'Id', name: 'bank_account_id', filter: true, sort: true, width: '2rem' },
      { label: 'Banco', name: 'bank_name', filter: true, sort: true, width: '10rem' },
      { label: 'Número de cuenta', name: 'number_accounts', filter: true, sort: true, width: '10rem' },
      { label: 'Tipo de cuenta', name: 'type', filter: true, width: '10rem' }
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
      <FormBanksAccount
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
