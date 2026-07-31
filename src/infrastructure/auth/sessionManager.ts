import { useSessionStore } from '../stores/session.store'
import { APP_ROUTES } from '../../core/shared/utils/constants'

/**
 * Limpia una sesión expirada para cualquier endpoint protegido.
 * Los endpoints de verificación y renovación usan `redirect = false` porque
 * el router debe intentar renovar la sesión antes de mostrar el login.
 */
export const validateSession = async (resp: Response, redirect = true) => {
  if (resp.status === 401) {
    await clearSession(redirect)
  }
}

export async function clearSession(redirect = true) {
  useSessionStore.getState().resetState()

  if (redirect && window.location.pathname !== APP_ROUTES.LOGIN) {
    window.location.href = APP_ROUTES.LOGIN
  }
}
