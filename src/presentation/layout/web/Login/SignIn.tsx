import { useFormik } from 'formik'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { useSessionStore } from '../../../../infrastructure/stores/session.store'
import { useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { useContainer } from '../../../hooks/useContainer'
import { APP_ROUTES } from '../../../../core/shared/utils/constants'

export const SignIn = () => {
  const clientId = import.meta.env.VITE_CLIENT_ID_GOOGLE?.trim()
  const toastTopCenter = useRef<Toast>(null)
  const navigate = useNavigate()
  const update = useSessionStore((state) => state.updateState)
  const { authRepository } = useContainer()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: async (values) => {
      try {
        const resp = await authRepository.authLogin(values)
        if (resp.isAuthenticated) {
          update(resp)
          navigate(`${APP_ROUTES.PRIVATE}/my-hotel`)
        } else {
          showMessage()
        }
      } catch {
        showMessage()
      }
    }
  })

  const { handleChange, handleSubmit, values } = formik
  const { username, password } = values

  const onSuccess = () => {
    // TODO: implementar login con Google
  }
  const onError = () => {
    showMessage()
  }
  const showMessage = () => {
    if (toastTopCenter?.current) {
      toastTopCenter?.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Usuario o clave incorrectas, valida por favor!',
        life: 3000
      })
    }
  }
  return (
    <>
      <section className='flex justify-around'>
        <form
          onSubmit={handleSubmit}
          className='w-2/6 h-auto'
        >
          <Toast
            ref={toastTopCenter}
            position='top-center'
          />
          <h1 className='mb-5'>Ingresar</h1>
          <div className='p-inputgroup flex-1 flex-wrap form-login'>
            <div className='p-float-label mb-6'>
              <InputText
                className='h-9 rounded-md'
                id='username'
                name='username'
                value={username}
                onChange={handleChange}
              />
              <label htmlFor='username'>Usuario</label>
            </div>
            <div className='p-float-label mb-5 w-[100%!important]'>
              <Password
                className='p-inputtext-sm w-[100%!important]'
                id='password'
                name='password'
                value={password}
                feedback={false}
                onChange={handleChange}
                toggleMask
              />
              <label htmlFor='password'>Contraseña</label>
            </div>
            <div className='m-auto w-full mb-5'>
              <Button
                type='submit'
                className='w-full bg-gradient-to-r from-blue-500 to-blue-400'
                label='Ingresar'
                size='small'
              />
            </div>
            {clientId && (
              <div className='w-full'>
                <GoogleOAuthProvider clientId={clientId}>
                  <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onError}
                  />
                </GoogleOAuthProvider>
              </div>
            )}
            <div className='w-full'>
              <a
                className='text-blue-400 font-semibold'
                href='#'
              >
                ¿Olvido su contraseña?
              </a>
            </div>
          </div>
        </form>
        <div className='w-3/6 border rounded-l-3xl bg-gradient-to-r from-blue-500 to-blue-400 p-5 text-slate-200 content-center'>
          <h1>Hola, bienvenido</h1>
          <p className='p-2'>
            Regístrese con sus datos personales para utilizar todas las
            funciones del sitio.
          </p>
          <Button
            className='button-login w-2/6 mt-5 bg-transparent border-slate-200'
            label='Registrarse'
            size='small'
            onClick={() => navigate('register')}
          />
        </div>
      </section>
    </>
  )
}
