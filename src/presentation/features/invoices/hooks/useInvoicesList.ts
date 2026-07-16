import {useCallback, useEffect} from 'react'
import type { IInvoices } from '../../../../core/shared/types/data'
import {useList} from '../../../hooks/useList'
import {useContainer} from '../../../hooks/useContainer'
import {createParamsUrl} from '../../../../core/shared/utils/utils'

export const useInvoicesList = () => {
  const { invoiceRepository } = useContainer()
  const {
    selectedRow,
    setSelectedRow,
    data,
    setData,
    loading,
    setLoading,
    setShowForm,
    toast,
    user,
    setAction
  } = useList<IInvoices>()

  const refreshList = useCallback(() => {
    setLoading(true)
    const params = {
      company_id: user.company_id,
      center_id: user.center_id
    }
    const urlParams = createParamsUrl(params)
    invoiceRepository
      .get(urlParams)
      .then((resp) => {
        setData(resp ?? [])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user.company_id, user.center_id, invoiceRepository, setData, setLoading])

  useEffect(() => {
    refreshList()
  }, [refreshList])

  const columns = [
    { label: 'Id', name: 'id', filter: true, sort: true, width: '2rem' },
    { label: 'Reserva', name: 'booking_id', filter: true, sort: true, width: '2rem' },
    { label: 'No Factura', name: 'invoice_number', filter: true, sort: true, width: '10rem' },
    { label: 'Fecha factura', name: 'invoice_date', filter: true, sort: true, width: '10rem' },
    { label: 'Facturado a', name: 'invoice_to', filter: true, sort: true, width: '10rem' },
    { label: 'Email', name: 'email', filter: true, sort: true, width: '10rem' },
    { label: 'Impuestos', name: 'taxes', filter: true, sort: true, width: '10rem' },
    { label: 'Otros servicios', name: 'other_services', filter: true, sort: true, width: '10rem' },
    { label: 'Subtotal', name: 'subtotal', filter: true, sort: true, width: '10rem' },
    { label: 'Total', name: 'total', filter: true, sort: true, width: '10rem' },
    { label: 'Metodo de pago', name: 'payment_method', type: 'text', filter: true, sort: true, width: '10rem' }
  ]

  const contextMenu = {
    selectedRow,
    setSelectedRow,
    menu: [
      selectedRow?.status == 'PENDIENTE' && {
        label: 'Transmitir factuara',
        icon: 'pi pi-fw pi-plus',
        command: () => console.log('Agregar anticipo')
      }
    ].filter(Boolean)
  }

  return {
    data,
    loading,
    setShowForm,
    toast,
    setAction,
    columns,
    contextMenu,
    refreshList
  }
}
