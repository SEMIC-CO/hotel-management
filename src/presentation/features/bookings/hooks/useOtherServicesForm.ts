import { useCallback, useState } from 'react'
import * as Yup from 'yup'
import type {
  IField,
  IPropsSave,
  IShow
} from '../../../../core/shared/types/forms'
import { useToast } from '../../../hooks/useToast'
import { useContainer } from '../../../hooks/useContainer'
import { useOtherServicesStore } from '../../../../infrastructure/stores/otherServices.store'

export const useOtherServicesForm = ({
  onActionForm,
  setShowForm
}: Omit<IShow, 'showForm'>) => {
  const { toast, showToast } = useToast()

  const { settingsRepository } = useContainer()
  const [loading] = useState(false)

  const { resetState } = useOtherServicesStore()

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
      // TODO: integrar guardado de otros servicios
      void values

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
