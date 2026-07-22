import { use, useCallback, useEffect, useState } from 'react'
import * as Yup from 'yup'
import type {
  IField,
  IOptionsSelect,
  IPropsSave,
  IShow
} from '../../../../core/shared/types/forms'
import { useToast } from '../../../hooks/useToast'
import { useContainer } from '../../../hooks/useContainer'
import { useSessionStore } from '../../../../infrastructure/stores/session.store'
import { createParamsUrl, formatCurrency, parseCurrency } from '../../../../core/shared/utils/utils'
import { useOtherServicesStore } from '../../../../infrastructure/stores/otherServices.store'

export const useOtherServicesForm = ({
  onActionForm,
  setShowForm
}: Omit<IShow, 'showForm'>) => {
  const { toast, showToast } = useToast()

  const { settingsRepository } = useContainer()
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState<IOptionsSelect[]>([])

  const { resetState, updateState } = useOtherServicesStore()
  const valuesState = useOtherServicesStore(state => state.values)
  const { user } = useSessionStore((state) => state.values)

  // useEffect(() => {
  //   setLoading(true)
  //   const urlParams = createParamsUrl({
  //     select: true,
  //     company_id: user.company_id,
  //     center_id: user.center_id
  //   })
  //   settingsRepository
  //     .getBanksAccounts<IOptionsSelect[]>(urlParams)
  //     .then((resp) => {
  //       setServices(resp ?? [])
  //       setLoading(false)
  //     })

  // }, [user.company_id, user.center_id, settingsRepository])




  const handleSave = useCallback(
    ({ values, setLoading: _setLoading }: IPropsSave) => {
      console.log("handleSave", values);

      // setLoading(true)
      // bookings.saveAdvance(values).then(resp => {
      //   console.log("saveAdvance", resp);
      //   if (typeof resp === 'undefined') return
      //   if (resp.ok) {
      //     resetState()
      //     setShowForm(false)
      //     showToast(
      //       resp?.message ?? 'Se registro el anticipo correctamente!',
      //       'success'
      //     )
      //     return
      //   }
      //   showToast(`Error al registrar el anticipo, ${resp.message}`, 'error')

      // }).finally(() => {
      //   setLoading(false)
      // })
    },
    [settingsRepository, onActionForm, setShowForm, resetState, showToast]
  )

  // const onSetValueInit = (val: string) => {
  //   updateState({ payment_date: val })
  // }


  const validationAmount = (e: any, form: any) => {
    console.log("validationAmount", parseCurrency(e.target.value))
    if (parseCurrency(e.target.value) > valuesState.total) {
      form.setFieldValue('amount', 0)
      showToast(`El valor del anticipo, no puede ser mayor al total de la reserva ${formatCurrency(valuesState.total)}`, 'error')
    }
  }



  const fields: IField[] = [
    {
      label: 'Fecha del servicio',
      name: 'service_date',
      type: 'date',
    },
    {
      label: 'Nombre del servicio',
      name: 'service_name',
      type: 'text',
    },
    {
      label: 'Cantidad',
      name: 'quantity',
      type: 'text',
      keyfilter: 'int'
    },
    {
      label: 'Valor unitario',
      name: 'unit_value',
      type: 'number',
    },
    {
      label: 'Valor total',
      name: 'total_value',
      type: 'number',
      disabled: true
    },
    {
      label: 'Observaciones',
      name: 'observations',
      type: 'textArea'
    }
  ]

  const validationSchema = Yup.object({
    service_date: Yup.string().required('Requerido'),
    service_name: Yup.string().required('Requerido'),
    quantity: Yup.number().required('Requerido'),
    unit_value: Yup.number().required(),
    total_value: Yup.number().required(),
    observations: Yup.string()
  })

  return {
    toast,
    loading,
    handleSave,
    validationSchema,
    fields
  }
}
