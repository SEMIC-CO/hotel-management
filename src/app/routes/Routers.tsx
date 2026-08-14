import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import {Dashboard} from '../../presentation/layout/dashboard/Dashboard'
import {Login} from '../../presentation/layout/web/Login'
import {ProtectedRoutes} from './ProtectedRoutes'
import {PublicRoutes} from './PublicRoutes'
import {useContainer} from '../../presentation/hooks/useContainer'
import {useSessionStore} from '../../infrastructure/stores/session.store'
import {useEffect, useState} from 'react'
import {ProgressBar} from 'primereact/progressbar'
import {APP_ROUTES} from '../../core/shared/utils/constants'

export const Routers = () => {
  const [loading, setLoading] = useState(true)
  const { updateState, resetState } = useSessionStore((state) => state)
  const { authRepository } = useContainer()

  useEffect(() => {
    let isMounted = true

    const bootstrapSession = async () => {
      try {
        const verifiedSession = await authRepository.verifySession()
        const session = verifiedSession === false
          ? await authRepository.refreshToken()
          : verifiedSession

        if (!isMounted) return

        if (session !== false && session.isAuthenticated) {
          updateState(session)
        } else {
          resetState()
        }
      } catch {
        if (isMounted) {
          resetState()
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void bootstrapSession()

    return () => {
      isMounted = false
    }
  }, [authRepository, resetState, updateState])

  if (loading) {
    return (
      <div className='card flex justify-center'>
        <ProgressBar
          className='w-1/2'
          mode='indeterminate'
          style={{ height: '6px' }}
        />
      </div>
    )
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<Navigate to={APP_ROUTES.LOGIN} replace />}
        />
        <Route
          path='web/*'
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path='/app/*'
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
