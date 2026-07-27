import {Navigate} from 'react-router-dom'
import {useSessionStore} from '../../infrastructure/stores/session.store'
import type { RoutesProps } from '../../core/shared/types/data'
import {APP_ROUTES} from '../../core/shared/utils/constants'

export const ProtectedRoutes: React.FC<RoutesProps> = ({ children }) => {
  const auth = useSessionStore((state) => state.values)
  const isAuthenticated = 'isAuthenticated' in auth && auth.isAuthenticated
  return isAuthenticated ? children : <Navigate to={APP_ROUTES.PUBLIC} />
}
