import { useSessionStore } from '../../infrastructure/stores/session.store'
import type { IUsers } from '../../core/shared/types/data'

/**
 * Devuelve el usuario autenticado. Solo debe usarse dentro de rutas
 * protegidas (/app), donde ProtectedRoutes garantiza que la sesión existe.
 */
export const useUser = (): IUsers => {
  const { user } = useSessionStore((state) => state.values)
  return user as IUsers
}