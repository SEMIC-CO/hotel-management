import { useCallback, useEffect, useState } from 'react'
import * as Yup from 'yup'
import type {
  IField,
  IOptionsSelect,
  IPropsSave,
  IShow
} from '../../../../core/shared/types/forms'
import type { IBookings } from '../../../../core/shared/types/data'
import { useToast } from '../../../hooks/useToast'
import { useContainer } from '../../../hooks/useContainer'
import { useUser } from '../../../hooks/useUser'
import { createParamsUrl, formatCurrency, parseCurrency } from '../../../../core/shared/utils/utils'
import { useAdvancesStore } from '../../../../infrastructure/stores/advances.store'
import { getApiErrorMessage } from '../../../../infrastructure/api/client/httpClient'

export const useAdvanceForm = ({
  onActionForm,
  setShowForm
}: Omit<IShow, 'showForm'>) => {
  const { toast, showToast } = useToast()

  const { settingsRepository, bookingRepository } = useContainer()
  const [loading, setLoading] = useState(false)
  const [accounts, setAccount] = useState<IOptionsSelect[]>([])
  const [disabled, setDisabled] = useState<boolean>(true)

  const { resetState, updateState } = useAdvancesStore()
  const valuesState = useAdvancesStore(state => state.values)
  const user = useUser()

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
      })
      .catch((error) => {
        setAccount([])
        showToast(
          getApiErrorMessage(error, 'No se pudieron cargar las cuentas bancarias.'),
          'error'
        )
      })
      .finally(() => {
        setLoading(false)
      })
    updateState({ payment_date: new Date() })
  }, [user.company_id, user.center_id, settingsRepository, showToast, updateState])

  const handleSave = useCallback(
    ({ values, setLoading: setFormLoading }: IPropsSave<IBookings>) => {
      setLoading(true)
      setFormLoading(true)
      bookingRepository
        .saveAdvance(values)
        .then((resp) => {
          if (resp.ok) {
            resetState()
            setShowForm(false)
            onActionForm?.(resp.data)
            showToast(
              resp.message ?? 'Se registro el anticipo correctamente!',
              'success'
            )
            return
          }
          showToast(
            `Error al registrar el anticipo, ${resp.message ?? 'intente nuevamente'}`,
            'error'
          )
        })
        .catch((error) => {
          showToast(
            getApiErrorMessage(error, 'No se pudo registrar el anticipo.'),
            'error'
          )
        })
        .finally(() => {
          setFormLoading(false)
          setLoading(false)
        })
    },
    [bookingRepository, onActionForm, setShowForm, resetState, showToast]
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

  const validationAmount = (e: any, form: any) => {
    if (parseCurrency(e.target.value) > valuesState.total) {
      form.setFieldValue('amount', 0)
      showToast(`El valor del anticipo, no puede ser mayor al total de la reserva ${formatCurrency(valuesState.total)}`, 'error')
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
      type: 'number',
      onBlur: validationAmount
    },
    {
      label: 'Método de pago',
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
      label: 'Referencia de transferencia',
      name: 'reference', type: 'text',
      disabled: disabled
    },
    {
      label: 'Observaciones',
      name: 'observations',
      type: 'textArea'
    }
  ]

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
