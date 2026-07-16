import {useCallback, useEffect, useState} from 'react'
import * as Yup from 'yup'
import type {
  IField,
  IOptionsSelect,
  IPropsSave,
  IShow
} from '../../../../core/shared/types/forms'
import {useToast} from '../../../hooks/useToast'
import {useContainer} from '../../../hooks/useContainer'
import {useCentersStore} from '../../../../infrastructure/stores/centers.store'
import {useSessionStore} from '../../../../infrastructure/stores/session.store'
import {createParamsUrl} from '../../../../core/shared/utils/utils'

export const useAdvanceForm = ({
  onActionForm,
  setShowForm
}: Omit<IShow, 'showForm'>) => {
  const { toast, showToast } = useToast()
  const { resetState } = useCentersStore()
  const { settingsRepository } = useContainer()
  const [loading, setLoading] = useState(false)
  const [accounts, setAccount] = useState<IOptionsSelect[]>([])
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
  }, [user.company_id, user.center_id, settingsRepository])

  const handleSave = useCallback(
    ({ values, setLoading }: IPropsSave) => {
      setLoading(true)
      settingsRepository.saveCenters(values).then((resp) => {
        if (typeof resp === 'undefined') return
        setLoading(false)
        if (resp.ok) {
          onActionForm?.(resp.data)
          setShowForm(false)
          resetState()
          showToast(
            resp?.message ?? 'Datos guardados correctamente!',
            'success'
          )
          return
        }
        showToast(`Error al crear el registro, ${resp.message}`, 'error')
      })
    },
    [settingsRepository, onActionForm, setShowForm, resetState, showToast]
  )

  const fields: IField[] = [
    { label: 'Fecha de entrada', name: 'payment_date', type: 'date' },
    { label: 'Valor de anticipo', name: 'amount', type: 'number' },
    {
      label: 'Metodo de pago',
      name: 'payment_method',
      type: 'select',
      placeholder: 'Seleccione',
      options: [
        { name: 'EFECTIVO', code: 'EFECTIVO' },
        { name: 'TRANFERENCIA', code: 'TRANFERENCIA' }
      ]
    },
    {
      label: 'Banco',
      name: 'bank_account_id',
      type: 'select',
      placeholder: 'Seleccione',
      options: accounts
    },
    { label: 'Referencia de tranferencia', name: 'reference', type: 'text' },
    { label: 'Observaciones', name: 'observations', type: 'textArea' }
  ]

  const validationSchema = Yup.object({
    payment_date: Yup.string().required('Requerido'),
    amount: Yup.string().required('Requerido'),
    payment_method: Yup.string().required('Requerido'),
    bank_account_id: Yup.string().required('Requerido'),
    reference: Yup.string().required('Requerido')
  })

  return {
    toast,
    loading,
    handleSave,
    validationSchema,
    fields
  }
}
