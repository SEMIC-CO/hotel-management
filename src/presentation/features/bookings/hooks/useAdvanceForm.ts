import { useCallback, useEffect, useState } from 'react'
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
import { createParamsUrl } from '../../../../core/shared/utils/utils'
import { useAdvancesStore } from '../../../../infrastructure/stores/advances.store'
import bookings from '../../../../infrastructure/api/services/BookingsServices'

export const useAdvanceForm = ({
  onActionForm,
  setShowForm
}: Omit<IShow, 'showForm'>) => {
  const { toast, showToast } = useToast()

  const { settingsRepository } = useContainer()
  const [loading, setLoading] = useState(false)
  const [accounts, setAccount] = useState<IOptionsSelect[]>([])
  const [disabled, setDisabled] = useState<boolean>(true)

  const { resetState, updateState } = useAdvancesStore()
  const valuesState = useAdvancesStore(state => state.values)
  const { user } = useSessionStore((state) => state.values)

  useEffect(() => {
    setLoading(true)
    const urlParams = createParamsUrl({
      select: true,
      company_id: user.company_id,
      center_id: user.center_id
    })
    settingsRepository
      .getBanksAccounts<IOptionsSelect[]>(urlParams)
      .then((resp) => {
        setAccount(resp ?? [])
        setLoading(false)
      })
    updateState({ payment_date: new Date() })
  }, [user.company_id, user.center_id, settingsRepository])

  const handleSave = useCallback(
    ({ values, setLoading: _setLoading }: IPropsSave) => {
      console.log("handleSave", values);

      setLoading(true)
      bookings.saveAdvance(values).then(resp => {
        console.log("saveAdvance", resp);
        if (typeof resp === 'undefined') return
        if (resp.ok) {
          resetState()
          setShowForm(false)
          showToast(
            resp?.message ?? 'Se registro el anticipo correctamente!',
            'success'
          )
          return
        }
        showToast(`Error al registrar el anticipo, ${resp.message}`, 'error')

      }).finally(() => {
        setLoading(false)
      })
    },
    [settingsRepository, onActionForm, setShowForm, resetState, showToast]
  )

  // const onSetValueInit = (val: string) => {
  //   updateState({ payment_date: val })
  // }

  const onChangeFunc = (e: { value: { code: string } }, form: any) => {
    const { value } = e
    if (value?.code === 'TRANSFERENCIA') {
      setDisabled(false)
    } else {
      form?.setFieldValue?.('bank_account_id', '')
      setDisabled(true)
    }
  }



  const fields: IField[] = [
    {
      label: 'Fecha de entrada',
      name: 'payment_date',
      type: 'date',
    },
    {
      label: 'Valor de anticipo',
      name: 'amount',
      type: 'number'
    },
    {
      label: 'Metodo de pago',
      name: 'payment_method',
      type: 'select',
      placeholder: 'Seleccione',
      onChangeFunc,
      options: [
        { name: 'EFECTIVO', code: 'EFECTIVO' },
        { name: 'TRANSFERENCIA', code: 'TRANSFERENCIA' }
      ]
    },
    {
      label: 'Banco',
      name: 'bank_account_id',
      type: 'select',
      placeholder: 'Seleccione',
      options: accounts,
      disabled: disabled
    },
    {
      label: 'Referencia de tranferencia',
      name: 'reference', type: 'text',
      disabled: disabled
    },
    {
      label: 'Observaciones',
      name: 'observations',
      type: 'textArea'
    }
  ]

  console.log("valuesState Advance", valuesState);


  const validationSchema = Yup.object({
    payment_date: Yup.string().required('Requerido'),
    amount: Yup.string().required('Requerido'),
    payment_method: Yup.string().required('Requerido'),
    bank_account_id: Yup.string().when('payment_method', {
      is: 'TRANSFERENCIA',
      then: (schema) => schema.required('Requerido'),
      otherwise: (schema) => schema
    }),
    reference: Yup.string().when('payment_method', {
      is: 'TRANSFERENCIA',
      then: (schema) => schema.required('Requerido'),
      otherwise: (schema) => schema
    })
  })

  return {
    toast,
    loading,
    handleSave,
    validationSchema,
    fields
  }
}
