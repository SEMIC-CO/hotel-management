import { useSessionStore } from '../stores/session.store'
import { APP_ROUTES } from '../../core/shared/utils/constants'

export const validateSession = async (resp: Response) => {
  if (resp.status === 401) {
    await clearSession()
  }
}

export async function clearSession() {
  useSessionStore.getState().resetState()
  window.location.href = APP_ROUTES.LOGIN
}
