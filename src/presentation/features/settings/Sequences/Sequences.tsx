import { useEffect } from 'react'
import { Toast } from 'primereact/toast'
import { DataList } from '../../../components/ui/DataTable/DataList'
import { FormSequences } from './FormSequences'
import { useCentersStore } from '../../../../infrastructure/stores/centers.store'
import { useContainer } from '../../../hooks/useContainer'
import { useSettingsList } from '../hooks/useSettingsList'

export const Sequences = () => {
  const { settingsRepository } = useContainer()
  const { updateState } = useCentersStore()
  const list = useSettingsList({
    getFn: settingsRepository.getSequences,
    deleteFn: settingsRepository.deleteCenter
  })

  useEffect(() => {
    list.setColumns([
      { label: 'Id', name: 'sequence_id', filter: true, sort: true, width: '2rem' },
      { label: 'Tipo de documento', name: 'document_type', filter: true, sort: true, width: '10rem' },
      { label: 'Nombre de consecutivo', name: 'sequence_name', filter: true, width: '10rem' },
      { label: 'Prefijo', name: 'prefix', filter: true, width: '3rem' },
      { label: 'Número inicial', name: 'start_number', filter: true, width: '10rem' },
      { label: 'Número final', name: 'end_number', filter: true, width: '10rem' },
      { label: 'Consecutivo máximo actual', name: 'current_number', filter: true, width: '10rem' },
      { label: 'Número de la resolución', name: 'resolution_number', filter: true, width: '10rem' },
      { label: 'Válido desde', name: 'valid_from', filter: true, width: '10rem' },
      { label: 'Válido hasta', name: 'valid_to', filter: true, width: '10rem' },
      { label: 'Activado', name: 'is_active', filter: true, width: '10rem' }
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
      <FormSequences
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
