import { Toast } from 'primereact/toast'
import { DataList } from '../../components/ui/DataTable/DataList'
import { FormBooking } from './FormBooking'
import { FormInvoice } from './FormInvoice'
import { FormAdvances } from './FormAdvances'
import { useBookingsList } from './hooks/useBookingsList'
import { FormOtherServices } from './FormOtherServices'
import { BOOKING_STATE } from '../../../core/shared/utils/constants'

export const Bookings = () => {
  const list = useBookingsList()

  const contextMenu = {
    selectedRow: list.selectedRow,
    setSelectedRow: list.setSelectedRow,
    menu: [
      (list.selectedRow?.state == BOOKING_STATE.PENDIENTE_CONFIRMAR ||
        list.selectedRow?.state == BOOKING_STATE.RESERVADA ||
        list.selectedRow?.state == BOOKING_STATE.INGRESO) && {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        command: () => list.update(list.selectedRow)
      },
      list.selectedRow?.state == BOOKING_STATE.INGRESO &&
      {
        label: 'Facturar estadía',
        icon: 'pi pi-fw pi-print',
        command: () => list.onFormInvoice(list.selectedRow)
      },
      {
        label: 'Agregar otros servicios',
        icon: 'pi pi-fw pi-list',
        command: () => list.onFormOtherServices(list.selectedRow)
      },
      list.selectedRow?.state == BOOKING_STATE.PENDIENTE_CONFIRMAR && {
        label: 'Confirmar reserva',
        icon: 'pi pi-fw pi-check',
        command: () => list.confirmReservation(list.selectedRow)
      },
      list.selectedRow?.state !== BOOKING_STATE.CANCELADA &&
        list.selectedRow?.state !== BOOKING_STATE.INGRESO && {
          label: 'Cancelar',
          icon: 'pi pi-fw pi-times',
          command: () => list.cancelReservation(list.selectedRow)
        },
      list.selectedRow?.state !== BOOKING_STATE.CANCELADA && {
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
        <FormAdvances
          onActionForm={list.onActionForm}
          showForm={list.showFormAdvance}
          setShowForm={list.setShowFormAdvance}
        />
        <FormOtherServices
          onActionForm={list.onActionForm}
          showForm={list.showFormOthers}
          setShowForm={list.setShowFormOthers}
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
