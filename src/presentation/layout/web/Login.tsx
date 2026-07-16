import { Card } from 'primereact/card'
import { SignIn } from './Login/SignIn'
import { SignUp } from './Login/SignUp'
import { useLocation } from 'react-router-dom'

export const Login = () => {
  const location = useLocation()
  const tab = location.pathname.replace('/web/', '') || 'login'

  return (
    <>
      <main className='main-web flex justify-center h-auto'>
        <Card
          title='Iniciar Sesión / Registrarse'
          className='w-4/5 shadow-lg'
        >
          {tab === 'register' ? <SignUp /> : <SignIn /> }
        </Card>
      </main>
    </>
  )
}
