import { Toast } from 'primereact/toast'
import { DataList } from '../../components/ui/DataTable/DataList'
import { FormBooking } from './FormBooking'
import { FormInvoice } from './FormInvoice'
import { FormAdavances } from './FormAdavances'
import { useBookingsList } from './hooks/useBookingsList'

export const Bookings = () => {
  const list = useBookingsList()

  const contextMenu = {
    selectedRow: list.selectedRow,
    setSelectedRow: list.setSelectedRow,
    menu: [
      (list.selectedRow?.state == 'PENDIENTE CONFIRMAR' ||
        list.selectedRow?.state == 'RESERVADA' ||
        list.selectedRow?.state == 'INGRESO') && {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        command: () => list.update(list.selectedRow)
      },
      list.selectedRow?.state == 'INGRESO' && {
        label: 'Facturar estadía',
        icon: 'pi pi-fw pi-print',
        command: () => list.onFormInvoice(list.selectedRow)
      },
      list.selectedRow?.state == 'PENDIENTE CONFIRMAR' && {
        label: 'Confirmar reserva',
        icon: 'pi pi-fw pi-check',
        command: () => list.confirmReservation(list.selectedRow)
      },
      list.selectedRow?.state !== 'CANCELADA' &&
        list.selectedRow?.state !== 'INGRESO' && {
          label: 'Cancelar',
          icon: 'pi pi-fw pi-times',
          command: () => list.cancelReservation(list.selectedRow)
        },
      list.selectedRow?.state !== 'CANCELADA' && {
        label: 'Agregar anticipo',
        icon: 'pi pi-fw pi-plus',
        command: () => list.onFormAdvance(list.selectedRow)
      }
    ].filter(Boolean)
  }

  return (
    <>
      <div className='card flex justify-content-center w-full'>
        <Toast ref={list.toast} />
        <FormBooking
          onActionForm={list.onActionForm}
          showForm={list.showForm}
          setShowForm={list.setShowForm}
          action={list.action}
        />
        <FormInvoice
          onActionForm={list.onActionForm}
          showForm={list.showFormInvoice}
          setShowForm={list.setShowFormInvoice}
        />
        <FormAdavances
          onActionForm={list.onActionForm}
          showForm={list.showFormAdvance}
          setShowForm={list.setShowFormAdvance}
        />
        <DataList
          setShowForm={list.setShowForm}
          columns={list.columns}
          data={list.data}
          loading={list.loading}
          contextMenu={contextMenu}
          actionsButtons={{ refresh: list.refreshList }}
          setAction={list.setAction}
        />
      </div>
    </>
  )
}
