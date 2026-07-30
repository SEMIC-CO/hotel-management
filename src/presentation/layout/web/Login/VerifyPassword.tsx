import {ErrorMessage, Formik} from 'formik'
import {Password} from 'primereact/password'
import * as Yup from 'yup'
import {useRegisterStore} from '../../../../infrastructure/stores/register.store'
import React, { useRef } from 'react'
import type { FormRef, IOptionsSelect } from '../../../../core/shared/types/forms'
import type { IRegister } from '../../../../core/shared/types/data'
import {useContainer} from '../../../hooks/useContainer'
import {Toast} from 'primereact/toast'
import {useNavigate} from 'react-router-dom'

export const VerifyPassword = React.forwardRef<FormRef>((_, ref) => {
  const navigate = useNavigate()
  const { authRepository } = useContainer()

  const toast = useRef<Toast>(null)

  const schema = Yup.object({
    password: Yup.string()
      .min(8, 'La contraseña debe tener minimo 8 caracteres')
      .required('Requerido'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Las contraseñas no coinciden')
      .required('Requerido')
  })

  const updateState = useRegisterStore((state) => state.updateState)
  const valuesState = useRegisterStore((state) => state.values)
  const resetState = useRegisterStore((state) => state.resetState)

  const showMessage = (severity: any, title: string, detail: string) => {
    if (toast?.current) {
      toast?.current.show({
        severity: severity,
        summary: title,
        detail: detail,
        life: 4000
      })
    }
  }

  return (
    <Formik
      initialValues={{
        password: '',
        confirm_password: ''
      }}
      validationSchema={schema}
      onSubmit={(values) => {
        updateState({ user: { ...valuesState.user, password: values.password } })
        const current = useRegisterStore.getState().values
        const data: IRegister = {
          user: { ...current.user, password: values.password },
          company: {
            ...current.company,
            country: String((current.company.country as IOptionsSelect).code ?? ''),
            city: String((current.company.city as IOptionsSelect).code ?? '')
          }
        }
        authRepository.registerCustomer(data)
          .then((resp) => {
            if (resp.ok) {
              resetState()
              navigate('login')
              showMessage(
                'success',
                'Registro exitoso!',
                'Se ha registrado correctamente, inicia sessión para probar su cuenta demo y conocer todos beneficios'
              )
              return
            }

            showMessage(
              'error',
              'No se ha podido completar su registro!',
              resp.message
            )
          })
          .catch(() => {
            showMessage(
              'error',
              'No se ha podido completar su registro!',
              'Verifique su conexión e intente nuevamente.'
            )
          }
          )
      }}
      innerRef={ref}
    >
      {({ handleSubmit, handleChange, values }) => (
        <section>
          <Toast
            ref={toast}
            position='top-center'
          />
          <form onSubmit={handleSubmit}>
            <div className='p-inputgroup flex-1 justify-between flex-wrap form-login'>
              <div className='flex flex-col text-left min-w-44 w-[45%]'>
                <label
                  className='top-field-web'
                  htmlFor='password'
                >
                  Contraseña
                </label>
                <Password
                  className='p-inputtext-sm w-[100%!important]'
                  id='password'
                  name='password'
                  value={values.password}
                  feedback={false}
                  onChange={handleChange}
                  toggleMask
                />
                <ErrorMessage
                  name='password'
                  render={(msg) => <small className='p-error'>{msg}</small>}
                />
              </div>
              <div className='flex flex-col text-left min-w-44 w-[45%]'>
                <label
                  className='top-field-web'
                  htmlFor='confirm_password'
                >
                  Confirmar contraseña
                </label>
                <Password
                  className='p-inputtext-sm w-[100%!important]'
                  id='password'
                  name='confirm_password'
                  value={values.confirm_password}
                  feedback={false}
                  onChange={handleChange}
                  toggleMask
                />
                <ErrorMessage
                  name='confirm_password'
                  render={(msg) => <small className='p-error'>{msg}</small>}
                />
              </div>
            </div>
          </form>
        </section>
      )}
    </Formik>
  )
})
