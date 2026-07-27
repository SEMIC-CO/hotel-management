import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {Dashboard} from '../../presentation/layout/dashboard/Dashboard'
import {Login} from '../../presentation/layout/web/Login'
import {ProtectedRoutes} from './ProtectedRoutes'
import {PublicRoutes} from './PublicRoutes'
import {useContainer} from '../../presentation/hooks/useContainer'
import type { ISession } from '../../core/shared/types/data'
import {useSessionStore} from '../../infrastructure/stores/session.store'
import {useEffect, useState} from 'react'
import {ProgressBar} from 'primereact/progressbar'

export const Routers = () => {
  const [loading, setLoading] = useState(true)
  const { updateState, resetState } = useSessionStore((state) => state)
  const { authRepository } = useContainer()
  useEffect(() => {
    authRepository.verifySession().then((resp: boolean | ISession) => {
      if (typeof resp !== 'boolean') {
        resp.isAuthenticated ? updateState(resp) : resetState()
      } else {
        authRepository.refreshToken().then((resp: boolean | ISession) => {
          if (typeof resp !== 'boolean') {
            resp.isAuthenticated ? updateState(resp) : resetState()
          } else {
            resetState()
          }
        })
      }
      setLoading(false)
    })
  }, [])

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
