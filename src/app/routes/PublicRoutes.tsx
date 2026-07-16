import {Navigate} from 'react-router-dom'
import {useSessionStore} from '../../infrastructure/stores/session.store'
import type { RoutesProps } from '../../core/shared/types/data'

export const PublicRoutes: React.FC<RoutesProps> = ({ children }) => {
  const auth = useSessionStore((state) => state.values)
  const isAuthenticated = 'isAuthenticated' in auth && auth.isAuthenticated
  return isAuthenticated ? <Navigate to='/app' /> : children
}
