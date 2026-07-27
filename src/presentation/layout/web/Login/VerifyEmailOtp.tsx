import {Button} from 'primereact/button'
import {InputOtp} from 'primereact/inputotp'
import {InputText} from 'primereact/inputtext'
import React, { type Dispatch, type SetStateAction, useRef, useState } from 'react'
import {useRegisterStore} from '../../../../infrastructure/stores/register.store'
import {Toast} from 'primereact/toast'

interface Props {
  setDisabled: Dispatch<SetStateAction<boolean>>
}

export const VerifyEmailOtp: React.FC<Props> = ({ setDisabled }) => {
  const [token, setTokens] = useState<string | number | null>()
  const toast = useRef<Toast>(null)

  const valuesState = useRegisterStore((state) => state.values)
  const { user } = valuesState

  const handleSendCode = () => {
    if (user.email === '') {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail:
          'El campo no puede ser vacio, complete las secciones anteriores',
        life: 3000
      })
    }
    // TODO: integrar envío de código de verificación al email
  }
  const onChange = (value: number) => {
    setTokens(value)
    if (value.toString().length > 3) {
      setDisabled(false)
    }
  }
  return (
    <section>
      <div className='p-inputgroup flex-1 justify-between flex-wrap gap-5'>
        <div className='flex flex-col text-left min-w-44 w-[45%]'>
          <label htmlFor='email'>E-mail</label>
          <InputText
            className='rounded-md w-[100%!important]'
            keyfilter='email'
            id='email'
            name='email'
            disabled
            value={user.email}
          />
        </div>
        <Toast
          ref={toast}
          position='center'
        />
        <div className='flex flex-col text-left min-w-44 w-[45%] flex-col-reverse'>
          <Button
            label='Enviar código'
            onClick={handleSendCode}
          />
        </div>
        <div className='flex flex-col  text-left w-full'>
          <label htmlFor='email'>Código de verificación</label>
          <InputOtp
            value={token}
            onChange={(e) => onChange(e.value as number)}
            integerOnly
          />
        </div>
      </div>
    </section>
  )
}
